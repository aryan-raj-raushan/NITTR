import { Input } from "~/components/ui/input";

export default function CardDetails() {
  return <div className="flex flex-col gap-2">
    <div>
      <div>Card Number</div>
      <Input placeholder="xxxx-xxxx-xxxx"></Input>
    </div>
    <div>
      <div>Name</div>
      <Input placeholder="John"></Input>
    </div>
    <div>
      <div>Valid Thru</div>
      <Input placeholder="MM/YY"></Input>
    </div>
    <div>
      <div>CVC</div>
      <Input placeholder="CVC"></Input>
    </div>
  </div>
}
