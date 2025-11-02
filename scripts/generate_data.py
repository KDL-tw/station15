#!/usr/bin/env python3
"""
Station 15 Data Generation Script
Generates synthetic transactions, invoices, and rules for demo purposes.
Per PRD: Data Generation: Python scripts.
"""

import random
import json
from datetime import datetime, timedelta
from typing import List, Dict

def generate_transactions(business_id: str, count: int = 30) -> List[Dict]:
    """Generate synthetic transactions for a business."""
    transactions = []
    base_date = datetime.now() - timedelta(days=30)
    
    transaction_types = ['inflow', 'outflow', 'recurring', 'one_time']
    
    for i in range(count):
        tx_date = base_date + timedelta(days=random.randint(0, 30))
        tx_type = random.choice(transaction_types)
        
        # Inflows are positive, outflows are negative
        if tx_type in ['inflow', 'recurring']:
            amount = random.uniform(5000, 50000)
        else:
            amount = -random.uniform(1000, 15000)
        
        transactions.append({
            'business_id': business_id,
            'amount': round(amount, 2),
            'type': tx_type,
            'date': tx_date.strftime('%Y-%m-%d'),
            'description': f'{tx_type.replace("_", " ").title()} transaction'
        })
    
    return transactions

def generate_invoices(business_id: str, customer_ids: List[str], count: int = 5) -> List[Dict]:
    """Generate synthetic invoices for a business."""
    invoices = []
    base_date = datetime.now()
    
    for i in range(count):
        due_date = base_date + timedelta(days=random.randint(7, 60))
        customer_id = random.choice(customer_ids)
        amount = random.uniform(1000, 10000)
        paid = random.random() > 0.6  # 40% chance of being paid
        
        paid_date = None
        if paid:
            paid_date = (due_date - timedelta(days=random.randint(0, 5))).strftime('%Y-%m-%d')
        
        invoices.append({
            'business_id': business_id,
            'customer_id': customer_id,
            'amount': round(amount, 2),
            'due_date': due_date.strftime('%Y-%m-%d'),
            'paid_date': paid_date,
            'paid': paid
        })
    
    return invoices

def generate_rules_config() -> Dict:
    """Generate PRD v0 rules configuration."""
    return {
        'version': 1,
        'rules': {
            'creditLimitMultiplier': 2.5,
            'policyCap': 100000,
            'riskThresholds': {
                'low': 0.3,
                'medium': 0.6,
                'high': 0.8
            },
            'underwritingRules': {
                'liquidity_min': 1.1,
                'recurring_min': 65.0,
                'cycles_min': 3,
                'on_time_min': 0.95,
                'volatility_haircut': 0.35
            }
        },
        'effective_at': datetime.now().isoformat()
    }

def main():
    """Main data generation function."""
    print("Station 15 - Data Generation Script")
    print("=" * 50)
    
    # Example business ID
    business_id = "demo-business-1"
    customer_ids = ["customer-1", "customer-2", "customer-3", "customer-4"]
    
    # Generate data
    transactions = generate_transactions(business_id, count=30)
    invoices = generate_invoices(business_id, customer_ids, count=5)
    rules = generate_rules_config()
    
    # Output
    output = {
        'business_id': business_id,
        'transactions': transactions,
        'invoices': invoices,
        'rules_config': rules,
        'generated_at': datetime.now().isoformat()
    }
    
    # Save to JSON file
    with open('generated_data.json', 'w') as f:
        json.dump(output, f, indent=2)
    
    print(f"Generated {len(transactions)} transactions")
    print(f"Generated {len(invoices)} invoices")
    print("Rules configuration generated")
    print("\nData saved to: generated_data.json")
    
    return output

if __name__ == '__main__':
    main()

