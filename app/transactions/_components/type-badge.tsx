import { Badge } from "@/app/_components/ui/badge";
import { Transaction, TransactionType } from "@prisma/client";
import { CircleIcon } from "lucide-react";

interface TransactionTypeBadgeProps {
  transaction: Transaction;
}

function TransactionTypeBadge({ transaction }: TransactionTypeBadgeProps) {
  if (transaction.type === TransactionType.DEPOSIT) {
    return (
      <Badge className="bg-muted text-primary hover:bg-muted">
        <CircleIcon className="mr-2 fill-primary" size={10} />
        Depósito
      </Badge>
    );
  }
  if (transaction.type === TransactionType.EXPENSE) {
    return (
      <Badge className="bg-red-500 bg-opacity-10 text-red-500 hover:bg-red-500">
        <CircleIcon className="mr-1 fill-red-500" size={10} />
        Despesa
      </Badge>
    );
  }
  return (
    <Badge className="bg-muted text-white hover:bg-muted">
      <CircleIcon className="mr-1 fill-white" size={10} />
      Investimento
    </Badge>
  );
}

export default TransactionTypeBadge;
