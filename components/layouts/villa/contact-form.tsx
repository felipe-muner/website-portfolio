"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";


export function ContactForm() {
  const [name, setName] = useState("");
  const [guests, setGuests] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [message, setMessage] = useState("");

  function send(event: React.FormEvent) {
    event.preventDefault();
  }

  return (
    <form onSubmit={send} className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-1.5">
          <Label htmlFor="contact-name">Name</Label>
          <Input
            id="contact-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="bg-shell"
            required
          />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="contact-guests">Guests</Label>
          <Input
            id="contact-guests"
            type="number"
            min={1}
            max={30}
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
            placeholder="How many of you?"
            className="bg-shell"
          />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-1.5">
          <Label htmlFor="contact-checkin">Check-in</Label>
          <Input
            id="contact-checkin"
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className="bg-shell"
          />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="contact-checkout">Check-out</Label>
          <Input
            id="contact-checkout"
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className="bg-shell"
          />
        </div>
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="contact-message">Anything else?</Label>
        <textarea
          id="contact-message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Celebrations, chef dinners, late arrivals — tell us everything."
          rows={4}
          className="bg-shell"
        />
      </div>
      <Button type="submit" size="lg" className="justify-self-start px-6">
        <MessageCircle data-icon="inline-start" />
        Send via WhatsApp
      </Button>
      <p className="text-xs text-muted-foreground">
        Demo form — in the real site this opens WhatsApp with your message
        ready to go.
      </p>
    </form>
  );
}
