const fs = require('fs');
const path = require('path');

class CounterTicket {
  constructor() {
    this.lastTicket = 0;
    this.currentDate = this.getDate();
    this.reloadCount();
  }
  next() {
    this.lastTicket += 1;
    this.saveCount();
    this.logging('next');
    return `Ticket ${this.lastTicket}`;
  }
  loadCount() {
    const stringData = fs.readFileSync(
      path.resolve(__dirname, '../data/counter-ticket.json'),
      { encoding: 'utf8', flag: 'r' },
    );
    const { lastTicket = 0, currentDate = 0 } = JSON.parse(stringData || {});
    this.logging('load');
    return {
      lastTicket,
      currentDate: currentDate || this.getDate(),
    };
  }
  saveCount() {
    fs.writeFileSync(
      path.resolve(__dirname, '../data/counter-ticket.json'),
      JSON.stringify(this.toJson()),
    );
    this.logging('saved');
  }
  reloadCount() {
    const { lastTicket = 0, currentDate = 0 } = this.loadCount();
    if (currentDate === this.currentDate) {
      this.lastTicket = lastTicket;
      return;
    }
    this.saveCount();
    this.logging('reload');
  }
  getDate() {
    const arrayDate = new Date().toISOString().split('T');
    return arrayDate[0] || '';
  }
  toJson() {
    return {
      lastTicket: this.lastTicket,
      currentDate: this.currentDate,
    };
  }
  logging(message = '') {
    console.log('Ticket system:', message);
  }
}

module.exports = CounterTicket;
