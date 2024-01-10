import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const token = searchParams.get('token')
  const fData = await fetch(
    `${process.env.API_REST_URL as string}/verify?token=${token}`,
  )

  if (fData.ok) {
    return NextResponse.json(await fData.json(), { status: 200 })
  }

  if (!fData.ok) {
    return NextResponse.json(await fData.json(), { status: fData.status })
  }
}

export async function HEAD(request: Request) {}

export async function POST(request: Request) {}

export async function PUT(request: Request) {}

export async function DELETE(request: Request) {}

export async function PATCH(request: Request) {}
