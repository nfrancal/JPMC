import { ServerRespond } from './DataStreamer';

export interface Row {
  // new variables for the interface on the data manipulator
  // declaration of variable types
  price_abc: number,
  price_def: number,
  ratio: number,
  upper_bound: number,
  lower_bound: number,
  // trigger allert can be undefined if the ratio remains within the threshold of the upper and lower bounds
  trigger_alert: number | undefined,
  timestamp: Date,
}


export class DataManipulator {
  static generateRow(serverRespond: ServerRespond[]): Row {
    // taking the average between the top bid price and the top ask price and dividing by two
    // this gives an unbiased representation of the overall price of the stock
    // this representation is needed for traders when they are comparing the overall effects of ABC and DEF
    const priceABC = (serverRespond[0].top_ask.price + serverRespond[0].top_ask.price)/2;
    const priceDEF = (serverRespond[1].top_ask.price + serverRespond[1].top_ask.price)/2;
    const ratio = priceABC/priceDEF;
    const upperBound = 1 + .03;
    const lowerBound = 1 - .03;
    return {
      price_abc: priceABC,
      price_def:priceDEF,
      ratio,
      timestamp: serverRespond[0].timestamp > serverRespond[1].timestamp ?
        serverRespond[0].timestamp : serverRespond[1].timestamp,
      upper_bound: upperBound,
      lower_bound:lowerBound,
      trigger_alert: (ratio > upperBound || ratio < lowerBound) ? ratio : undefined,
    };
  }
}