import type { Meta, StoryObj } from '@storybook/react';
import { Card, CardHeader, CardContent, CardFooter } from './Card';
import { Button } from '../Button/Button';

const meta: Meta<typeof Card> = {
  component: Card,
  title: 'Core/Card',
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold">Card Title</h3>
      </CardHeader>
      <CardContent>
        <p>This is the card content area.</p>
      </CardContent>
    </Card>
  ),
};

export const WithFooter: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold">Card with Footer</h3>
      </CardHeader>
      <CardContent>
        <p>Card content with action buttons in footer.</p>
      </CardContent>
      <CardFooter>
        <Button variant="outline">Cancel</Button>
        <Button>Save</Button>
      </CardFooter>
    </Card>
  ),
};

export const Interactive: Story = {
  render: () => (
    <Card className="cursor-pointer hover:shadow-lg transition-shadow">
      <CardHeader>
        <h3 className="text-lg font-semibold">Clickable Card</h3>
      </CardHeader>
      <CardContent>
        <p>This card has hover effects.</p>
      </CardContent>
    </Card>
  ),
};

