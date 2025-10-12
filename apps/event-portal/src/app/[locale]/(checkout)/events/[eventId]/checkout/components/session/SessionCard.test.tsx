/**
 * SessionCard Component Jest Tests
 */

import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

import { SessionCard } from './SessionCard';

// Mock 數據
const mockSession = {
  id: 'session-1',
  eventId: 'event-1',
  name: '第一場花火秀',
  date: '2024-12-31',
  time: '19:00 - 21:00',
  capacity: 100,
  currentAttendees: 50,
  status: 'upcoming' as const,
  tickets: [
    {
      id: 'ticket-1',
      sessionId: 'session-1',
      name: 'general',
      description: '一般票',
      price: 750,
      totalQuantity: 100,
      availableQuantity: 50,
      status: 'selling' as const,
      saleStartTime: '2024-01-01T00:00:00Z',
      saleEndTime: '2024-12-30T23:59:59Z',
    },
  ],
};

describe('SessionCard', () => {
  it('should render session information correctly', () => {
    render(
      <SessionCard
        session={mockSession}
        isSelected={false}
        isAvailable={true}
        remainingTickets={50}
        onSelect={() => {}}
      />
    );

    expect(screen.getByText('第一場花火秀')).toBeInTheDocument();
    expect(
      screen.getByText('2024-12-31 19:00 - 21:00 • 台北101')
    ).toBeInTheDocument();
    expect(screen.getByText('剩餘票卷: 50 張')).toBeInTheDocument();
  });

  it('should show remaining tickets correctly', () => {
    render(
      <SessionCard
        session={mockSession}
        isSelected={false}
        isAvailable={true}
        remainingTickets={25}
        onSelect={() => {}}
      />
    );

    expect(screen.getByText('剩餘票卷: 25 張')).toBeInTheDocument();
  });

  it('should apply selected styling when selected', () => {
    const { container } = render(
      <SessionCard
        session={mockSession}
        isSelected={true}
        isAvailable={true}
        remainingTickets={50}
        onSelect={() => {}}
      />
    );

    const card = container.firstChild;
    expect(card).toHaveClass('border-blue-500', 'bg-blue-50');
  });

  it('should call onSelect when clicked', () => {
    const mockOnSelect = jest.fn();
    const { container } = render(
      <SessionCard
        session={mockSession}
        isSelected={false}
        isAvailable={true}
        remainingTickets={50}
        onSelect={mockOnSelect}
      />
    );

    const card = container.firstChild as HTMLElement;
    card.click();

    expect(mockOnSelect).toHaveBeenCalled();
  });

  it('should show sold out when no tickets available', () => {
    render(
      <SessionCard
        session={mockSession}
        isSelected={false}
        isAvailable={false}
        remainingTickets={0}
        onSelect={() => {}}
      />
    );

    expect(screen.getByText('已售完')).toBeInTheDocument();
  });

  it('should be disabled when sold out', () => {
    const { container } = render(
      <SessionCard
        session={mockSession}
        isSelected={false}
        isAvailable={false}
        remainingTickets={0}
        onSelect={() => {}}
      />
    );

    const card = container.firstChild;
    expect(card).toHaveClass('cursor-not-allowed', 'opacity-60');
  });
});
