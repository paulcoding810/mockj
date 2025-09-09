import { db } from "@mockj/db";
import { NextRequest, NextResponse } from "next/server";

export async function OPTIONS(request: NextRequest) {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Credentials": "true",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,OPTIONS,PATCH,DELETE,POST,PUT",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

export async function GET(request: NextRequest) {
  try {
    // Get the slug from the URL path
    const url = new URL(request.url);
    const pathSegments = url.pathname.split("/");
    const slug = pathSegments[pathSegments.length - 1];

    if (!slug) {
      return NextResponse.json(
        { error: "Missing slug parameter" },
        { status: 400 }
      );
    }

    // Query the database for the JSON object
    const jsonData = await db.query.jsons.findFirst({
      where: (jsons, { eq }) => eq(jsons.id, slug),
    });

    if (!jsonData) {
      return NextResponse.json({ error: "JSON not found" }, { status: 404 });
    }

    // Parse the JSON string and return it
    try {
      const parsedJson = JSON.parse(jsonData.json);
      return NextResponse.json(parsedJson, {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      });
    } catch (parseError) {
      // If JSON parsing fails, return as plain text
      return new NextResponse(jsonData.json, {
        status: 200,
        headers: {
          "Content-Type": "text/plain",
        },
      });
    }
  } catch (error) {
    console.error("Error fetching JSON:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
