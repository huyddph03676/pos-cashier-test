export enum STATUS_CODE {
  SUCCESS = 200,
}

export enum DISCOUNT_TYPE {
  BUY_N = 'BUY_N',
  PERCENT = 'PERCENT',
}

export const DISCOUNT_TYPE_ARRAY = ['BUY_N', 'PERCENT'];

export const DATE_FORMAT = 'DD MMMM YYYY';

export const PAYMENT_TYPE_ARRAY = ['CASH', 'E-WALLET', 'EDC'];

export const PRODUCT_TEMPLATE = `
<tr>
  <td><span contenteditable>[PRODUCT_NAME]</span></td>
  <td><span contenteditable>[PRODUCT_QTY]</span></td>
  <td><span contenteditable>[NORMAL_PRICE]</span></td>
  <td><span contenteditable>[FINAL_PRICE]</span></td>
</tr>`;
