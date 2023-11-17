import csv
from datetime import datetime
from collections import defaultdict

# Function to parse the timestamp and return a string with the format "YYYY-MM"
def parse_timestamp(timestamp_str):
    date = datetime.strptime(timestamp_str, '%Y-%m-%dT%H:%M:%SZ')
    return date.strftime('%Y-%m')

# Function to calculate total amount for each category for each month
def calculate_totals(data):
    totals = defaultdict(float)
    for entry in data:
        month = parse_timestamp(entry['timestamp'])
        category = entry['category']
        amount = float(entry['amount'])
        totals[(month, category)] += amount
    return totals

# This function would be used to read data from a CSV file
def read_csv_data(file_path):
    with open(file_path, newline='') as csvfile:
        reader = csv.DictReader(csvfile)
        return [row for row in reader]

# Replace '/path/to/your/file.csv' with the actual file path of your CSV
file_path = 'data/FinancialJournal.csv'
data = read_csv_data(file_path)

# Calculate the totals
totals = calculate_totals(data)

# Converting the totals to a list of dictionaries for easy usage or display
totals_list = [{'month': month, 'category': category, 'total_amount': total_amount}
               for (month, category), total_amount in totals.items()]

csv_file_name = 'modified_financial_journal.csv'

# Specify the fieldnames (column names) for the CSV file
fieldnames = ['month', 'category', 'total_amount']

# Open the CSV file in write mode
with open(csv_file_name, 'w', newline='') as csvfile:
    # Create a CSV writer object
    csv_writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
    
    # Write the header row
    csv_writer.writeheader()
    
    # Write the data rows
    for row in totals_list:
        csv_writer.writerow(row)