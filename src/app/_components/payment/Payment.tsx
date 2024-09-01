import React from "react";

const PaymentForm = ({ actionURL, mercid, bdorderid, rdata }: any) => {
  return (
    <form action={actionURL} method="POST">
      <input type="hidden" name="mercid" value={mercid} />
      <input type="hidden" name="bdorderid" value={bdorderid} />
      <input type="hidden" name="rdata" value={rdata} />
      <input type="submit" value="Complete Payment" />
    </form>
  );
};

export default PaymentForm;
