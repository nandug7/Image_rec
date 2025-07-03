exports.extractTotalAndCategory = function (text) {
  let totalAmount = null;
  let category = 'Other'; // default

  if (!text || typeof text !== 'string') {
    console.warn('No text provided to parser.');
    return { totalAmount, category };
  }

  const lower = text.toLowerCase();

  const totalRegex = /(amount due|total due|grand total|current billed balance)[^\d₹$]*[₹$]?\s*([\d,.]+)/i;
  const match = text.match(totalRegex);

  if (match && match[2]) {
    totalAmount = parseFloat(match[2].replace(/,/g, ''));
  } else {
    // ✅ Fallback: largest ₹ or $ amount
    const allMatches = [...text.matchAll(/[$₹][\d,.]+/g)];
    const amounts = allMatches.map(m =>
      parseFloat(m[0].replace(/[^0-9.]/g, ''))
    ).filter(n => !isNaN(n));

    if (amounts.length > 0) {
      totalAmount = Math.max(...amounts);
    }
  }

  if (totalAmount === null) {
    const allAmounts = [...text.matchAll(/[$₹]([\d,.]+)/g)].map(m => {
      return parseFloat(m[1].replace(/,/g, ''));
    }).filter(n => !isNaN(n));

    if (allAmounts.length > 0) {
      totalAmount = Math.max(...allAmounts);
    }
  }

  // ✅ Same category detection as before
  if (lower.includes('student') || lower.includes('tuition')) {
    category = 'Education';
  } else if (lower.includes('grocery') || lower.includes('supermarket')) {
    category = 'Groceries';
  } else if (lower.includes('restaurant') || lower.includes('food') || lower.includes('dine')) {
    category = 'Food & Dining';
  } else if (lower.includes('rent') || lower.includes('housing')) {
    category = 'Housing';
  } else if (lower.includes('electricity') || lower.includes('water') || lower.includes('utility')) {
    category = 'Utilities';
  } else if (lower.includes('travel') || lower.includes('flight') || lower.includes('hotel')) {
    category = 'Travel';
  }

  console.log('✅ [Parser] Extracted:', { totalAmount, category });
  console.log('📄 OCR text:', text.substring(0, 300), '...');
  console.log('🔍 Regex match:', match);
  console.log('💰 Final totalAmount:', totalAmount);
  console.log('🏷️ Final category:', category);

  return { totalAmount, category };
};
