import { Component } from 'react';
import { Card } from '@/types/Card.js';
import { Deck } from '@/types/Deck.js';
import Start from './Start';
import Stop from './Stop';
import Step from './Step';
import { Result } from '@/types/Result';

type Props = {
  setStep: (change: number) => void;
  setResults: (change: any) => void;
  handleSubmit: () => void;
  step: number;
  cards: Card[];
  deck: Deck;
  results: any;
};

export default class Controller extends Component<Props> {
  prevStep = () => {
    this.props.setStep(this.props.step - 1);
  };
  nextStep = () => {
    this.props.setStep(this.props.step + 1);
  };

  handleChange = (result: Result) => {
    this.props.setResults((prev: any) => [...prev, result]);
  };

  render() {
    if (this.props.step == -1) {
      return (
        <Start
          nextStep={this.nextStep}
          deck={this.props.deck}
          deckLength={this.props.cards.length}
        />
      );
    } else if (this.props.step >= 0 && this.props.step < this.props.cards.length) {
      return (
        <Step
          step={this.props.step}
          nextStep={this.nextStep}
          cards={this.props.cards}
          handleChange={this.handleChange}
        />
      );
    } else if (this.props.step == this.props.cards.length) {
      return (
        <Stop
          results={this.props.results}
          handleSubmit={this.props.handleSubmit}
        />
      );
    } else {
      return <p>No cards found</p>;
    }
  }
}
