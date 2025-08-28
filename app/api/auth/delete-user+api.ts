import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Create admin client with service role key
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

export async function POST(request: Request) {
  try {
    // Parse the request body
    const { userId } = await request.json();

    if (!userId) {
      return Response.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    if (!supabaseServiceKey) {
      return Response.json(
        { error: "Service role key not configured" },
        { status: 500 }
      );
    }

    // Soft delete the user using Supabase Admin API
    const { data, error } = await supabaseAdmin.auth.admin.deleteUser(
      userId,
      true // shouldSoftDelete = true
    );

    if (error) {
      console.error("Error soft deleting user:", error);
      return Response.json(
        { error: "Failed to delete user account" },
        { status: 500 }
      );
    }

    return Response.json(
      { 
        success: true, 
        message: "User account has been soft deleted successfully",
        data 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error in delete-user API:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
