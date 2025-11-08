"use client";

/**
 * Skill Mode Renderer - Renders interactive skill UI components
 *
 * This component handles all skill mode UI rendering based on skill_name and render type.
 * When a skill enters "skill mode", it can return structured UI components that
 * this renderer will display instead of plain text.
 *
 * Currently supports:
 * - ticket_booking: Event booking workflow (event confirmation, quantity, payment)
 * - (Add more skills as needed)
 */

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Calendar,
  MapPin,
  Clock,
  DollarSign,
  Users,
  CreditCard,
  Smartphone,
  Wallet,
  CheckCircle2,
  Info
} from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

interface SkillModeRendererProps {
  skillName: string;
  renderType: string;
  data: any;
  onUserAction: (input: string) => void;
}

export function SkillModeRenderer({
  skillName,
  renderType,
  data,
  onUserAction
}: SkillModeRendererProps) {
  // Route to appropriate skill renderer
  if (skillName === "ticket_booking") {
    return (
      <TicketBookingRenderer
        renderType={renderType}
        data={data}
        onUserAction={onUserAction}
      />
    );
  }

  // Fallback for unknown skills
  return (
    <Card className="p-4">
      <div className="text-sm text-muted-foreground mb-2">
        Unknown skill: {skillName}
      </div>
      <pre className="text-xs overflow-auto">
        {JSON.stringify(data, null, 2)}
      </pre>
    </Card>
  );
}

/**
 * Ticket Booking Skill Renderer
 *
 * Handles all UI states for ticket booking workflow:
 * - event_confirmation: Show event card with confirm/cancel buttons
 * - event_details: Detailed event information
 * - number_input: Quantity selection
 * - payment_options: Payment method selection
 * - booking_confirmation: Final confirmation with booking ID
 */
function TicketBookingRenderer({ renderType, data, onUserAction }: {
  renderType: string;
  data: any;
  onUserAction: (input: string) => void;
}) {
  const [selectedQuantity, setSelectedQuantity] = useState(data.default || 2);
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);

  // Event Confirmation UI
  if (data.type === "event_confirmation") {
    const event = data.event;
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="group relative overflow-hidden hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
          {/* Demo Badge */}
          <div className="absolute top-2 right-2 z-10">
            <Badge variant="secondary" className="text-xs bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200">
              Demo Only
            </Badge>
          </div>

          {/* Event Image Header */}
          <div className="h-32 bg-gradient-to-br from-blue-500/10 to-blue-600/10 dark:from-blue-500/20 dark:to-blue-600/20 flex items-center justify-center border-b">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-500/10 dark:bg-blue-500/20">
              <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>

          {/* Event Details */}
          <div className="p-4 space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {event.name}
              </h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>{event.date} at {event.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>{event.venue}</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>${event.price} per ticket</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>{event.available_seats} seats available</span>
                </div>
              </div>
            </div>

            {/* Demo Disclaimer */}
            <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg p-2">
              <p className="text-xs text-amber-800 dark:text-amber-200">
                <Info className="w-3 h-3 inline mr-1" />
                This is a demonstration skill showcasing interactive workflows. No actual booking will be made.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              {data.buttons?.map((button: string, idx: number) => (
                <Button
                  key={idx}
                  variant={idx === 0 ? "default" : "outline"}
                  onClick={() => onUserAction(button)}
                  className="flex-1 text-xs"
                  size="sm"
                >
                  {button}
                </Button>
              ))}
            </div>
          </div>

          {/* Hover Effect Border */}
          <div className="absolute inset-0 border-2 border-blue-500/0 group-hover:border-blue-500/20 rounded-lg transition-colors pointer-events-none" />
        </Card>
      </motion.div>
    );
  }

  // Event Details UI (extended info)
  if (data.type === "event_details") {
    const event = data.event;
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="group relative overflow-hidden hover:shadow-lg transition-all duration-200 hover:-translate-y-1 p-4 space-y-4">
          <div className="flex items-start gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500/10 dark:bg-blue-500/20 flex-shrink-0">
              <Info className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-sm mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{event.name}</h3>
              <p className="text-xs text-muted-foreground mb-4 line-clamp-3">
                {event.description}
              </p>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <div className="text-muted-foreground mb-1">Date & Time</div>
                  <div className="font-medium">{event.date}</div>
                  <div className="text-muted-foreground">{event.time}</div>
                </div>
                <div>
                  <div className="text-muted-foreground mb-1">Venue</div>
                  <div className="font-medium">{event.venue}</div>
                </div>
                <div>
                  <div className="text-muted-foreground mb-1">Price</div>
                  <div className="font-medium">${event.price}/ticket</div>
                </div>
                <div>
                  <div className="text-muted-foreground mb-1">Available</div>
                  <div className="font-medium">{event.available_seats} seats</div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            {data.buttons?.map((button: string, idx: number) => (
              <Button
                key={idx}
                variant={idx === 0 ? "default" : "outline"}
                onClick={() => onUserAction(button)}
                className="flex-1 text-xs"
                size="sm"
              >
                {button}
              </Button>
            ))}
          </div>

          {/* Hover Effect Border */}
          <div className="absolute inset-0 border-2 border-blue-500/0 group-hover:border-blue-500/20 rounded-lg transition-colors pointer-events-none" />
        </Card>
      </motion.div>
    );
  }

  // Number Input UI (quantity selection)
  if (data.type === "number_input") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <Card className="group relative overflow-hidden hover:shadow-lg transition-all duration-200 hover:-translate-y-1 p-4">
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium mb-2 block">
                {data.label}
              </label>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedQuantity(Math.max(data.min || 1, selectedQuantity - 1))}
                  disabled={selectedQuantity <= (data.min || 1)}
                >
                  -
                </Button>
                <Input
                  type="number"
                  value={selectedQuantity}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if (!isNaN(val)) {
                      setSelectedQuantity(Math.min(Math.max(data.min || 1, val), data.max || 10));
                    }
                  }}
                  min={data.min || 1}
                  max={data.max || 10}
                  className="text-center text-sm font-semibold w-20"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedQuantity(Math.min(data.max || 10, selectedQuantity + 1))}
                  disabled={selectedQuantity >= (data.max || 10)}
                >
                  +
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Min: {data.min || 1}, Max: {data.max || 10}
              </p>
            </div>

            <Button
              onClick={() => onUserAction(selectedQuantity.toString())}
              className="w-full"
              size="sm"
            >
              Continue
            </Button>
          </div>

          {/* Hover Effect Border */}
          <div className="absolute inset-0 border-2 border-blue-500/0 group-hover:border-blue-500/20 rounded-lg transition-colors pointer-events-none" />
        </Card>
      </motion.div>
    );
  }

  // Payment Options UI
  if (data.type === "payment_options") {
    const paymentIcons = {
      "card": CreditCard,
      "upi": Smartphone,
      "wallet": Wallet
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="group relative overflow-hidden hover:shadow-lg transition-all duration-200 hover:-translate-y-1 p-4 space-y-4">
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-xs text-muted-foreground">Total Amount</span>
            <span className="text-lg font-bold">${data.amount}</span>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium block mb-2">
              Select Payment Method
            </label>
            {data.options?.map((option: any) => {
              const Icon = paymentIcons[option.id as keyof typeof paymentIcons] || CreditCard;
              const isSelected = selectedPayment === option.id;

              return (
                <Card
                  key={option.id}
                  className={`p-3 cursor-pointer transition-all ${
                    isSelected
                      ? "ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950"
                      : "hover:bg-accent"
                  }`}
                  onClick={() => setSelectedPayment(option.id)}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isSelected ? "bg-blue-500 text-white" : "bg-muted"
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-xs">{option.label}</div>
                    </div>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-500" />}
                  </div>
                </Card>
              );
            })}
          </div>

          <Button
            onClick={() => onUserAction(selectedPayment || data.options[0].id)}
            disabled={!selectedPayment}
            className="w-full"
            size="sm"
          >
            Pay ${data.amount}
          </Button>

          {/* Hover Effect Border */}
          <div className="absolute inset-0 border-2 border-blue-500/0 group-hover:border-blue-500/20 rounded-lg transition-colors pointer-events-none" />
        </Card>
      </motion.div>
    );
  }

  // Booking Confirmation UI
  if (data.type === "booking_confirmation") {
    return (
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", duration: 0.5 }}
      >
        <Card className="group relative overflow-hidden hover:shadow-lg transition-all duration-200 p-4 text-center space-y-3">
          <div className="mx-auto w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>

          <div>
            <h3 className="text-lg font-bold mb-1">Booking Confirmed!</h3>
            <p className="text-xs text-muted-foreground">Your tickets are ready</p>
          </div>

          <div className="bg-muted/50 rounded-lg p-3 space-y-2 text-left">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Booking ID</span>
              <span className="font-mono font-semibold">{data.booking_id}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Event</span>
              <span className="font-medium">{data.event.name}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Date</span>
              <span>{data.event.date}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Tickets</span>
              <span>{data.quantity} × ${data.event.price}</span>
            </div>
            <div className="border-t pt-2 mt-2 flex justify-between font-semibold text-xs">
              <span>Total Paid</span>
              <span className="text-green-600 dark:text-green-400">${data.total}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Payment Method</span>
              <span>{data.payment_method}</span>
            </div>
          </div>

          <Badge variant="outline" className="text-xs">
            Tickets sent to your email
          </Badge>

          {/* Hover Effect Border */}
          <div className="absolute inset-0 border-2 border-blue-500/0 group-hover:border-blue-500/20 rounded-lg transition-colors pointer-events-none" />
        </Card>
      </motion.div>
    );
  }

  // Fallback for unknown render types
  return (
    <Card className="p-4">
      <div className="text-sm text-muted-foreground mb-2">
        Unknown render type: {data.type}
      </div>
      <pre className="text-xs overflow-auto">
        {JSON.stringify(data, null, 2)}
      </pre>
    </Card>
  );
}
