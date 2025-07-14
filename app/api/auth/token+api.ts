import {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI,
} from "@/lib/constants";
import { createClient } from "@supabase/supabase-js";

// Create a Supabase client for server-side operations
const supabaseAdmin = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // Use service role key for admin operations
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

export async function POST(request: Request) {
  try {
    let code = "";

    // Handle multipart/form-data (which is what the client is sending)
    try {
      const formData = await request.formData();

      // Use type assertion to access FormData methods
      const formDataAny = formData as any;

      code = formDataAny.get?.("code") || "";
    } catch (formError) {
      return Response.json(
        { error: "Failed to parse request data" },
        { status: 400 }
      );
    }

    if (!code) {
      return Response.json(
        { error: "Missing authorization code" },
        { status: 400 }
      );
    }

    // Exchange authorization code for Google tokens
    const tokenExchangeParams = {
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      redirect_uri: GOOGLE_REDIRECT_URI,
      grant_type: "authorization_code",
      code: code,
    };

    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(tokenExchangeParams),
    });

    const tokenData = await response.json();

    if (!response.ok || tokenData.error) {
      console.error("Google token exchange error:", tokenData);
      return Response.json(
        {
          error: tokenData.error || "Token exchange failed",
          error_description: tokenData.error_description,
        },
        { status: 400 }
      );
    }

    // Get user info from Google
    const userResponse = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
        },
      }
    );

    if (!userResponse.ok) {
      return Response.json(
        { error: "Failed to get user info from Google" },
        { status: 400 }
      );
    }

    const googleUser = await userResponse.json();

    // Validate Google user data
    if (!googleUser.email) {
      return Response.json(
        { error: "No email received from Google" },
        { status: 400 }
      );
    }

    // Try to create user, if it fails because user exists, we'll generate a session anyway
    let userId: string | undefined;

    const { data: userData, error: userError } =
      await supabaseAdmin.auth.admin.createUser({
        email: googleUser.email,
        email_confirm: true, // Mark email as confirmed since it's from Google
        user_metadata: {
          full_name: googleUser.name,
          avatar_url: googleUser.picture,
          provider: "google",
          provider_id: googleUser.id,
          given_name: googleUser.given_name,
          family_name: googleUser.family_name,
        },
      });

    if (userData?.user) {
      userId = userData.user.id;
    } else if (
      userError &&
      (userError.message.includes("already exists") ||
        userError.message.includes("already been registered"))
    ) {
      // User exists, we'll look them up next
    } else if (userError) {
      console.error("Supabase user creation error:", userError);
      return Response.json({ error: userError.message }, { status: 400 });
    }

    // For existing users, query the profiles table directly
    if (!userId) {
      const { data: profile, error: profileError } = await supabaseAdmin
        .from("players")
        .select("id")
        .eq("email", googleUser.email)
        .single();

      if (profileError || !profile) {
        return Response.json({ error: "User not found" }, { status: 400 });
      }

      userId = profile.id;
    }

    // Ensure we have a userId before proceeding
    if (!userId) {
      console.error("No userId found after user lookup");
      return Response.json(
        { error: "User authentication failed" },
        { status: 500 }
      );
    }

    // Generate a magic link and extract tokens from it
    const { data: linkData, error: linkError } =
      await supabaseAdmin.auth.admin.generateLink({
        type: "magiclink",
        email: googleUser.email,
        options: {
          redirectTo: `${process.env.EXPO_PUBLIC_SUPABASE_URL}/auth/v1/callback`,
        },
      });

    if (linkError) {
      console.error("Supabase link generation error:", linkError);
      return Response.json(
        { error: "Failed to create session" },
        { status: 500 }
      );
    }

    // Parse the magic link to extract the token
    const linkUrl = new URL(linkData.properties.action_link);
    const token = linkUrl.searchParams.get("token");
    const type = linkUrl.searchParams.get("type");

    if (!token || type !== "magiclink") {
      return Response.json(
        { error: "Failed to generate valid session token" },
        { status: 500 }
      );
    }

    // Verify the magic link token to create a session
    const { data: sessionData, error: verifyError } =
      await supabaseAdmin.auth.verifyOtp({
        token_hash: token,
        type: "magiclink",
      });

    if (verifyError || !sessionData.session) {
      console.error("Token verification error:", verifyError);
      return Response.json(
        { error: "Failed to verify session token" },
        { status: 500 }
      );
    }

    return Response.json({
      access_token: sessionData.session.access_token,
      refresh_token: sessionData.session.refresh_token,
      token_type: "bearer",
      expires_in: sessionData.session.expires_in || 3600,
      user: sessionData.user,
    });
  } catch (error) {
    console.error("Token exchange error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
