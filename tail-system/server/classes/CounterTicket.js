const fs = require('fs');
const path = require('path');
const Ticket = require('./Ticket');

class CounterTicket {
  constructor() {
    this.lastTicket = 0;
    this.currentDate = this.getDate();
    this.tickets = [];
    this.takeTickets = [];
    this.reloadCount();
  }
  nextTicket() {
    this.lastTicket += 1;
    const ticket = new Ticket(this.lastTicket, null);
    this.tickets.push(ticket);
    this.saveCount();
    this.logging('nextTicket');
    return `Ticket ${this.lastTicket}`;
  }
  currentTicket() {
    this.logging('currentTicket');
    return `Ticket ${this.lastTicket}`;
  }
  takeTicket(desktop = 0) {
    if (!this.tickets.length) {
      return 'Without Tickets';
    }
    const [firstTicket = {}] = this.tickets;
    this.tickets.shift();
    const { number = 0 } = firstTicket;
    const ticket = new Ticket(number, desktop);
    this.takeTickets.unshift(ticket);
    if (this.takeTickets.length > 4) {
      this.takeTickets.splice(-1, 1);
    }

    this.saveCount();

    return ticket;
  }
  loadCount() {
    const stringData = fs.readFileSync(
      path.resolve(__dirname, '../data/counter-ticket.json'),
      { encoding: 'utf8', flag: 'r' },
    );
    const {
      lastTicket = 0,
      currentDate = 0,
      tickets = [],
      takeTickets = [],
    } = JSON.parse(stringData || {});
    this.logging('load');
    return {
      lastTicket,
      currentDate: currentDate || this.getDate(),
      tickets: Array.isArray(tickets) ? tickets : [],
      takeTickets: Array.isArray(takeTickets) ? takeTickets : [],
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
    const {
      lastTicket = 0,
      currentDate = 0,
      tickets = [],
      takeTickets = [],
    } = this.loadCount();
    if (currentDate === this.currentDate) {
      this.lastTicket = lastTicket;
      this.tickets = tickets;
      this.takeTickets = takeTickets;
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
      tickets: this.tickets,
      takeTickets: this.takeTickets,
    };
  }
  logging(message = '') {
    console.log('Ticket system:', message);
  }
}

module.exports = CounterTicket;
