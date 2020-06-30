import * as R from "ramda";

export const isEmptyOrNil = value => {
  if (value !== undefined) {
    return R.isNil(value) || R.isEmpty(value);
  }

  return false;
};
