// Name: lodash-example

import "@johnlindquist/kit";
import _ from "express";

const array = [1, 2, 3, 4, 5];

const result = _.chunk(array, 2);

console.log(result);
