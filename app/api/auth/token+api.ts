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
    let codeVerifier = "";

    const contentType = request.headers.get("content-type") || "";
    console.log("Content-Type:", contentType);

    // Handle different content types
    if (contentType.includes("application/json")) {
      // Handle JSON requests
      const body = await request.json();
      console.log("Parsed JSON body:", body);
      code = body.code || "";
      codeVerifier = body.code_verifier || "";
    } else if (contentType.includes("application/x-www-form-urlencoded")) {
      // Handle URL-encoded form data
      const text = await request.text();
      console.log("Raw request text:", text);
      const params = new URLSearchParams(text);
      code = params.get("code") || "";
      codeVerifier = params.get("code_verifier") || "";
    } else if (contentType.includes("multipart/form-data")) {
      // Handle multipart form data
      try {
        const formData = await request.formData();
        console.log("Parsed FormData successfully");
        
        // Use type assertion to access FormData methods
        const formDataAny = formData as any;
        
        code = formDataAny.get?.("code") || "";
        codeVerifier = formDataAny.get?.("code_verifier") || "";
        
        // Log form fields for debugging
        if (formDataAny.forEach) {
          const formEntries: string[] = [];
          formDataAny.forEach((value: any, key: any) => {
            formEntries.push(`${key}: ${typeof value === 'string' ? value : '[File/Blob]'}`);
          });
          console.log("FormData entries:", formEntries.join(", "));
        }
      } catch (formError) {
        console.log("FormData parsing failed:", formError);
      }
    } else {
      // Fallback: try to parse as text/URLSearchParams
      try {
        const text = await request.text();
        console.log("Raw request text:", text);
        const params = new URLSearchParams(text);
        code = params.get("code") || "";
        codeVerifier = params.get("code_verifier") || "";
      } catch (error) {
        console.log("Failed to parse request body:", error);
      }
    }

    console.log("Final parsed - code:", code ? "present" : "missing");
    console.log(
      "Final parsed - code_verifier:",
      codeVerifier ? "present" : "missing"
    );
    
    // Log the actual values for debugging (first few characters only)
    if (code) {
      console.log("Code preview:", code.substring(0, 10) + "...");
    }
    if (codeVerifier) {
      console.log("Code verifier preview:", codeVerifier.substring(0, 10) + "...");
    }

    if (!code) {
      return Response.json(
        { error: "Missing authorization code" },
        { status: 400 }
      );
    }

    // Debug the OAuth configuration
    console.log("GOOGLE_CLIENT_ID:", GOOGLE_CLIENT_ID ? "present" : "missing");
    console.log(
      "GOOGLE_CLIENT_SECRET:",
      GOOGLE_CLIENT_SECRET ? "present" : "missing"
    );
    console.log("GOOGLE_REDIRECT_URI:", GOOGLE_REDIRECT_URI);

    // Exchange authorization code for Google tokens
    const tokenExchangeParams = {
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      redirect_uri: GOOGLE_REDIRECT_URI,
      grant_type: "authorization_code",
      code: code,
      // Don't include code_verifier since our custom OAuth flow doesn't use PKCE
    };

    console.log("Token exchange params:", {
      ...tokenExchangeParams,
      client_secret: "***",
      code: "***",
    });

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
    console.log("Google user info:", {
      email: googleUser.email,
      name: googleUser.name,
    });

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
      console.log("Created new user:", userId);
    } else if (
      userError &&
      (userError.message.includes("already exists") ||
        userError.message.includes("already been registered"))
    ) {
      console.log("User already exists, proceeding with session generation...");
      // We'll generate a magic link anyway, which should work for existing users
    } else if (userError) {
      console.error("Supabase user creation error:", userError);
      return Response.json({ error: userError.message }, { status: 400 });
    }

    // For existing users, we need to handle them differently
    if (!userId) {
      console.log("User already exists, need to find their ID...");
      
      // Try to get user by listing users - we'll need to paginate through to find the user
      let foundUser = null;
      let page = 1;
      const perPage = 100; // Reasonable page size
      
      while (!foundUser && page <= 10) { // Limit to 10 pages (1000 users) to prevent infinite loops
        const { data: users, error: listError } = 
          await supabaseAdmin.auth.admin.listUsers({
            page,
            perPage,
          });
        
        if (listError) {
          console.error("Error listing users:", listError);
          break;
        }
        
        // Find user by email
        foundUser = users.users.find(user => user.email === googleUser.email);
        
        if (!foundUser && users.users.length < perPage) {
          // We've reached the end of the user list
          break;
        }
        
        page++;
      }
      
      if (foundUser) {
        userId = foundUser.id;
        console.log("Found existing user:", userId);
      } else {
        console.error("No user found for email:", googleUser.email);
        return Response.json({ error: "User not found" }, { status: 400 });
      }
    }

    // Update user metadata to include Google information
    const { data: updatedUser, error: updateError } =
      await supabaseAdmin.auth.admin.updateUserById(userId, {
        user_metadata: {
          full_name: googleUser.name,
          avatar_url: googleUser.picture,
          provider: "google",
          provider_id: googleUser.id,
          given_name: googleUser.given_name,
          family_name: googleUser.family_name,
        },
      });

    if (updateError) {
      console.warn("Failed to update user metadata:", updateError);
      // Continue anyway, this is not critical
    } else {
      console.log("Updated user metadata successfully");
    }

    // Generate a magic link and extract tokens from it
    console.log("Generating magic link for session creation...");
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
      console.error("Invalid magic link generated");
      return Response.json(
        { error: "Failed to generate valid session token" },
        { status: 500 }
      );
    }

    // Verify the magic link token to create a session
    console.log("Verifying magic link token...");
    const { data: sessionData, error: verifyError } =
      await supabaseAdmin.auth.verifyOtp({
        token_hash: token,
        type: "magiclink",
      });

    if (verifyError) {
      console.error("Token verification error:", verifyError);
      return Response.json(
        { error: "Failed to verify session token" },
        { status: 500 }
      );
    }

    console.log("Session created successfully");
    console.log("Session user:", sessionData.user?.email);

    // Return the Supabase tokens
    if (!sessionData.session) {
      console.error("No session created from verification");
      return Response.json(
        { error: "Failed to create session" },
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
