'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, Save, X as XIcon } from 'lucide-react';

type PriceInterval = 'month' | 'year';

type ProductPrice = {
  nickname: string;
  unitAmount: number;
  currency: string;
  interval: PriceInterval;
};

type Product = {
  id?: string;
  name: string;
  description: string;
  features: string[];
  prices: ProductPrice[];
  metadata: {
    tier: string;
    ai_credits_amount: string;
    recommended?: string;
  };
};

type ProductFormProps = {
  product?: Product;
  profitMargin: number;
  onSave: (product: Product) => void;
  onCancel: () => void;
};

export function ProductForm({ product, profitMargin, onSave, onCancel }: ProductFormProps) {
  const [name, setName] = useState(product?.name || '');
  const [description, setDescription] = useState(product?.description || '');
  const [features, setFeatures] = useState<string[]>(product?.features || ['']);
  const [tier, setTier] = useState(product?.metadata.tier || '');
  const [recommended, setRecommended] = useState(product?.metadata.recommended === 'true');
  const [prices, setPrices] = useState<ProductPrice[]>(
    product?.prices || [
      { nickname: '', unitAmount: 0, currency: 'usd', interval: 'month' },
    ]
  );

  // Calculate AI credits based on monthly price and profit margin
  const calculateAICredits = (): string => {
    // Find the monthly price
    const monthlyPrice = prices.find(p => p.interval === 'month');
    if (!monthlyPrice || !monthlyPrice.unitAmount) {
      return '0.00';
    }

    const priceInDollars = monthlyPrice.unitAmount / 100;
    const credits = Math.max(0, priceInDollars - profitMargin);
    return credits.toFixed(2);
  };

  const aiCredits = calculateAICredits();

  const handleAddFeature = () => {
    setFeatures([...features, '']);
  };

  const handleRemoveFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const handleFeatureChange = (index: number, value: string) => {
    const updated = [...features];
    updated[index] = value;
    setFeatures(updated);
  };

  const handleAddPrice = () => {
    setPrices([
      ...prices,
      { nickname: '', unitAmount: 0, currency: 'usd', interval: 'month' },
    ]);
  };

  const handleRemovePrice = (index: number) => {
    setPrices(prices.filter((_, i) => i !== index));
  };

  const handlePriceChange = (index: number, field: keyof ProductPrice, value: any) => {
    const updated = [...prices];
    updated[index] = { ...updated[index], [field]: value };
    setPrices(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Filter out empty features
    const filteredFeatures = features.filter((f) => f.trim() !== '');

    // Validate
    if (!name || !description || filteredFeatures.length === 0 || prices.length === 0) {
      return;
    }

    const newProduct: Product = {
      id: product?.id,
      name,
      description,
      features: filteredFeatures,
      prices,
      metadata: {
        tier: tier.toLowerCase(),
        ai_credits_amount: aiCredits,
        ...(recommended && { recommended: 'true' }),
      },
    };

    onSave(newProduct);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{product ? 'Edit Product' : 'New Product'}</CardTitle>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <XIcon className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Base Plan"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of the plan"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tier">Tier (lowercase) *</Label>
              <Input
                id="tier"
                value={tier}
                onChange={(e) => setTier(e.target.value)}
                placeholder="e.g., base, plus, pro"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ai-credits">AI Credits Amount (auto-calculated)</Label>
              <div className="flex gap-2 items-center">
                <span className="text-sm text-muted-foreground">$</span>
                <Input
                  id="ai-credits"
                  value={aiCredits}
                  readOnly
                  disabled
                  className="bg-muted"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Formula: Monthly Price (${prices.find(p => p.interval === 'month')?.unitAmount ? (prices.find(p => p.interval === 'month')!.unitAmount / 100).toFixed(2) : '0.00'}) - Profit Margin (${profitMargin.toFixed(2)}) = ${aiCredits}
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="recommended"
                checked={recommended}
                onChange={(e) => setRecommended(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="recommended" className="cursor-pointer">
                Mark as Recommended Plan
              </Label>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Features *</Label>
              <Button type="button" size="sm" variant="outline" onClick={handleAddFeature}>
                <Plus className="w-4 h-4 mr-2" />
                Add Feature
              </Button>
            </div>
            <div className="space-y-2">
              {features.map((feature, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={feature}
                    onChange={(e) => handleFeatureChange(index, e.target.value)}
                    placeholder={`Feature ${index + 1}`}
                  />
                  {features.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveFeature(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Prices */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Prices *</Label>
              <Button type="button" size="sm" variant="outline" onClick={handleAddPrice}>
                <Plus className="w-4 h-4 mr-2" />
                Add Price
              </Button>
            </div>
            <div className="space-y-4">
              {prices.map((price, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">Price {index + 1}</h4>
                    {prices.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemovePrice(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label>Nickname</Label>
                      <Input
                        value={price.nickname}
                        onChange={(e) => handlePriceChange(index, 'nickname', e.target.value)}
                        placeholder="Base Monthly"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Interval</Label>
                      <select
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={price.interval}
                        onChange={(e) =>
                          handlePriceChange(index, 'interval', e.target.value as PriceInterval)
                        }
                      >
                        <option value="month">Monthly</option>
                        <option value="year">Yearly</option>
                      </select>
                    </div>
                    <div className="space-y-2 col-span-2">
                      <Label>Amount (cents)</Label>
                      <div className="flex gap-2 items-center">
                        <span className="text-sm text-muted-foreground">$</span>
                        <Input
                          type="number"
                          min="0"
                          value={price.unitAmount || ''}
                          onChange={(e) =>
                            handlePriceChange(index, 'unitAmount', e.target.value ? parseInt(e.target.value) : 0)
                          }
                          placeholder="3000 = $30.00"
                          required
                        />
                        {price.unitAmount > 0 && (
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            = ${(price.unitAmount / 100).toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">
              <Save className="w-4 h-4 mr-2" />
              {product ? 'Update Product' : 'Add Product'}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
