// app/api/subscribe/route.ts
import { NextResponse } from "next/server"
import { DynamoDBClient, UpdateItemCommand } from "@aws-sdk/client-dynamodb"

const dynamoDb = new DynamoDBClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
  }
})
export async function POST(request: Request) {
  const { email, isVegan, isVegetarian, isHalal, allergens } =
    await request.json()

  try {
    // Update or create the item in the DynamoDB table
    const updateCommand = new UpdateItemCommand({
      TableName: "users", // Make sure this matches the actual table name
      Key: {
        email: { S: email }
      },
      UpdateExpression:
        "SET is_vegan = :isVegan, is_vegetarian = :isVegetarian, is_halal = :isHalal, unavailable_foods = :unavailableFoods",
      ExpressionAttributeValues: {
        ":isVegan": { BOOL: isVegan },
        ":isVegetarian": { BOOL: isVegetarian },
        ":isHalal": { BOOL: isHalal },
        ":unavailableFoods": {
          L: allergens.map((allergen: string) => ({ S: allergen }))
        }
      },
      ReturnValues: "ALL_NEW"
    })

    const response = await dynamoDb.send(updateCommand)
    return NextResponse.json({
      message: "Subscription updated successfully",
      data: response.Attributes // Return updated attributes for confirmation
    })
  } catch (error) {
    console.error("Error saving to DynamoDB", error)
    return NextResponse.error()
  }
}
