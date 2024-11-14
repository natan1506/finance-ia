import AddTransactionButton from "@/app/_components/add-transaction-button";
import { Card, CardHeader, CardContent } from "@/app/_components/ui/card";
import { ReactNode } from "react";

interface SummaryCardProps {
  icon: ReactNode;
  title: string;
  amount: number;
  size?: "sm" | "lg";
}

function SummaryCard({ icon, title, amount, size = "sm" }: SummaryCardProps) {
  return (
    <Card className={`${size === "lg" ? "bg-white bg-opacity-5" : ""}`}>
      <CardHeader className="flex-row items-center gap-2">
        {icon}
        <p
          className={`${size === "sm" ? "text-muted-foreground" : "text-white opacity-70"}`}
        >
          {title}
        </p>
      </CardHeader>
      <CardContent className="flex justify-between">
        <p className={`font-bold ${size === "sm" ? "text-2xl" : "text-4xl"}`}>
          {Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(amount)}
        </p>

        {size === "lg" && <AddTransactionButton />}
      </CardContent>
    </Card>
  );
}

export default SummaryCard;
