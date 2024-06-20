interface IFormatGuestOptions {
  noInfants?: boolean;
}

export const formatGuests = ({ children, adults, infants }: any, options?: IFormatGuestOptions) => {
  if (!adults && !children && !infants) return false;
  const { noInfants } = options || {};
  const total = parseInt(adults) + parseInt(children);
  if (!total) return 0;
  let template = `${total} guest`;
  if (total >= 2) template = `${total} guests`;
  if (infants && !noInfants) template += `, ${infants} infant`;
  return template;
};
