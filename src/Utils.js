/**
 * Created by Jamey McElveen on 9/1/16.
 */

export const $ = (selector, ctx) => {
  return (ctx || document).querySelectorAll(selector);
};
