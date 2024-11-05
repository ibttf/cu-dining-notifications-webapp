// app/api/unsubscribe/route.ts
import { NextResponse } from "next/server"
import { DynamoDBClient, DeleteItemCommand } from "@aws-sdk/client-dynamodb"

const dynamoDb = new DynamoDBClient({ region: "us-east-1" })

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    // Delete the item from the DynamoDB table
    const deleteCommand = new DeleteItemCommand({
      TableName: "users", // Same table name as in subscribe route
      Key: {
        email: { S: email }
      },
      ReturnValues: "ALL_OLD" // This will return the deleted item's attributes
    })

    const response = await dynamoDb.send(deleteCommand)

    // Check if an item was actually deleted
    if (!response.Attributes) {
      return NextResponse.json(
        { message: "Email not found in subscription list" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      message: "Subscription successfully removed",
      data: response.Attributes
    })
  } catch (error) {
    console.error("Error deleting from DynamoDB:", error)
    return NextResponse.json(
      { message: "Error processing unsubscribe request" },
      { status: 500 }
    )
  }
}
