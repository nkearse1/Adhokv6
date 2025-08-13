export const accept_bid_clicked = 'accept_bid_clicked';
export const accept_bid_success = 'accept_bid_success';
export const accept_bid_gated_modal_open = 'accept_bid_gated_modal_open';
export const accept_bid_project_unlock = 'accept_bid_project_unlock';
export const client_upgrade_accept_bid_tier = 'client_upgrade_accept_bid_tier';

export type AcceptBidEvent =
  | typeof accept_bid_clicked
  | typeof accept_bid_success
  | typeof accept_bid_gated_modal_open
  | typeof accept_bid_project_unlock
  | typeof client_upgrade_accept_bid_tier;
