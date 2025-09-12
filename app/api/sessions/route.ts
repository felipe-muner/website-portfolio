// /app/api/sessions/route.ts

// import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // const sessions = await prisma.classSession.findMany({
    //   orderBy: { startDatetime: "asc" },
    // });
    // const sessions: any[] = []; // Placeholder - Prisma removed

    return NextResponse.json({}, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch sessions" },
      { status: 500 }
    );
  }
}

// POST: Create a new session
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { teacher, classname, startDatetime, endDatetime } = body;

    if (!teacher || !classname || !startDatetime || !endDatetime) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // const session = await prisma.classSession.create({
    //   data: {
    //     teacher,
    //     classname,
    //     startDatetime: new Date(startDatetime),
    //     endDatetime: new Date(endDatetime)
    //   }
    // });
    const session = { id: Date.now(), teacher, classname, startDatetime, endDatetime }; // Placeholder

    return NextResponse.json(session, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create session" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { sessionId } = body;

    if (!sessionId) {
      return NextResponse.json(
        { error: "Missing sessionId" },
        { status: 400 }
      );
    }

    // await prisma.classSession.delete({
    //   where: { id: sessionId },
    // });

    return NextResponse.json({ message: "Session deleted successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete session" },
      { status: 500 }
    );
  }
}