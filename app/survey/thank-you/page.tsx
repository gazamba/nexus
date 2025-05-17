import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"

export default function ThankYouPage() {
  return (
    <div className="container py-10 flex items-center justify-center min-h-[70vh]">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl">Thank You!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Your survey responses have been submitted successfully. Our team will analyze your workflow and create a
            customized automation solution for you.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link href="/">
            <Button>Return to Dashboard</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
