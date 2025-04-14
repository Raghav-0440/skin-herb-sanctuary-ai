import { plantsData } from '@/data/plantsData';

export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatHistory {
  messages: Message[];
}

const MISTRAL_API_KEY = 'SgXA2mbdpruWWvrLH2r7dHompPBOzle9';
const MISTRAL_API_URL = 'https://api.mistral.ai/v1/chat/completions';

const SYSTEM_PROMPT = `You are a highly knowledgeable herbal skincare assistant for the Skin Herb Sanctuary website. Your expertise includes:

1. Comprehensive Knowledge:
   - Deep understanding of herbal ingredients and their properties
   - Extensive knowledge of traditional healing practices
   - Scientific understanding of skin biology and conditions
   - Expertise in natural skincare formulations
   - Understanding of Ayurvedic, Traditional Chinese Medicine, and other traditional healing systems

2. Safety and Ethics:
   - Always prioritize user safety
   - Never recommend potentially harmful ingredients or practices
   - Always suggest consulting healthcare professionals for serious conditions
   - Be transparent about limitations of natural remedies
   - Respect traditional knowledge while acknowledging modern medical advice

3. Response Guidelines:
   - Provide evidence-based information
   - Include scientific names of plants
   - Explain mechanisms of action when relevant
   - Mention potential side effects or precautions
   - Suggest alternatives when appropriate
   - Be clear about what you know and don't know

4. Specific Areas of Expertise:
   - Skin conditions and their natural treatments
   - Herbal ingredient properties and benefits
   - Traditional remedy formulations
   - Skincare routine optimization
   - Natural preservatives and stabilizers
   - Plant-based alternatives to synthetic ingredients

5. Response Structure:
   - Start with a clear answer to the question
   - Provide supporting evidence or explanation
   - Include relevant precautions or warnings
   - Suggest complementary approaches
   - End with a safety reminder if appropriate

Remember: Your primary goal is to provide accurate, safe, and helpful information while encouraging responsible use of natural remedies.`;

export async function callMistralAI(messages: Message[]): Promise<string> {
  try {
    const response = await fetch(MISTRAL_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MISTRAL_API_KEY}`
      },
      body: JSON.stringify({
        model: 'mistral-tiny',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      throw new Error(`API call failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error calling Mistral AI:', error);
    throw error;
  }
}

export function getPlantInfo(plantName: string): string | null {
  const plant = Object.values(plantsData).find(
    p => p.name.toLowerCase() === plantName.toLowerCase() ||
    p.scientificName.toLowerCase() === plantName.toLowerCase()
  );

  if (!plant) return null;

  return `
Name: ${plant.name}
Scientific Name: ${plant.scientificName}
Description: ${plant.description}
Parts Used: ${plant.partsUsed.join(', ')}
Active Compounds: ${plant.activeCompounds.join(', ')}
Therapeutic Properties: ${plant.therapeuticProperties.join(', ')}
Dosage Forms: ${plant.dosageForms.join(', ')}
AYUSH Applications: ${plant.ayushApplications.join(', ')}
Health Benefits: ${plant.healthBenefits.join(', ')}
  `.trim();
}

export async function generateResponse(userInput: string, chatHistory: ChatHistory): Promise<string> {
  // Check if the user is asking about a specific plant
  const plantInfo = getPlantInfo(userInput);
  if (plantInfo) {
    return plantInfo;
  }

  // Get the last few messages for context
  const recentMessages = chatHistory.messages.slice(-5);
  const conversationContext = recentMessages.map(m => `${m.role}: ${m.content}`).join('\n');
  
  // Check if this is a follow-up question
  const isFollowUp = userInput.toLowerCase().includes('used') || 
                    userInput.toLowerCase().includes('tried') || 
                    userInput.toLowerCase().includes('before') || 
                    userInput.toLowerCase().includes('didn\'t work') ||
                    userInput.toLowerCase().includes('what about') ||
                    userInput.toLowerCase().includes('how about');
  
  // Extract multiple concerns from the message
  const concerns = extractConcerns(userInput);
  
  // If this is a follow-up or has multiple concerns, use a more contextual approach
  if (isFollowUp || concerns.length > 1) {
    try {
      const response = await callMistralAI([
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'system', content: `Previous conversation context:\n${conversationContext}` },
        { role: 'user', content: userInput }
      ]);
      return response;
    } catch (error) {
      console.error('Error generating contextual response:', error);
      return 'I apologize, but I encountered an error. Please try again later.';
    }
  }

  // For simple queries, use the standard approach
  try {
    const response = await callMistralAI(chatHistory.messages);
    return response;
  } catch (error) {
    console.error('Error generating response:', error);
    return 'I apologize, but I encountered an error. Please try again later.';
  }
}

// Helper function to extract multiple concerns from a user message
function extractConcerns(message: string): string[] {
  const concerns: string[] = [];
  const lowerMessage = message.toLowerCase();
  
  // Common skin concerns
  const skinConcerns = [
    'acne', 'pimple', 'breakout', 'eczema', 'psoriasis', 'rosacea', 
    'wrinkle', 'fine line', 'dark circle', 'under eye', 'sunburn', 
    'rash', 'infection', 'dry', 'oily', 'combination', 'sensitive'
  ];
  
  // Common ingredients
  const ingredients = [
    'neem', 'aloe', 'tea tree', 'turmeric', 'honey', 'vitamin c', 
    'niacinamide', 'retinol', 'hyaluronic acid', 'azadirachta'
  ];
  
  // Check for skin concerns
  for (const concern of skinConcerns) {
    if (lowerMessage.includes(concern)) {
      concerns.push(concern);
    }
  }
  
  // Check for ingredients
  for (const ingredient of ingredients) {
    if (lowerMessage.includes(ingredient)) {
      concerns.push(ingredient);
    }
  }
  
  // Check for treatment-related keywords
  if (lowerMessage.includes('treatment') || lowerMessage.includes('remedy') || 
      lowerMessage.includes('mask') || lowerMessage.includes('routine')) {
    concerns.push('treatment');
  }
  
  return concerns;
}

export interface SkinAssessment {
  skinType: string;
  concerns: string[];
  sensitivity: string;
  routine: string;
  recommendations: string[];
}

export function getSkinAssessment(answers: Record<string, string>): SkinAssessment {
  // Simple skin type assessment logic
  const skinType = determineSkinType(answers);
  const concerns = identifyConcerns(answers);
  const sensitivity = assessSensitivity(answers);
  const routine = generateRoutine(skinType, concerns, sensitivity);
  const recommendations = getRecommendations(skinType, concerns, sensitivity);

  return {
    skinType,
    concerns,
    sensitivity,
    routine,
    recommendations
  };
}

function determineSkinType(answers: Record<string, string>): string {
  // Logic to determine skin type based on answers
  if (answers.oily === 'yes' && answers.dry === 'yes') return 'Combination';
  if (answers.oily === 'yes') return 'Oily';
  if (answers.dry === 'yes') return 'Dry';
  return 'Normal';
}

function identifyConcerns(answers: Record<string, string>): string[] {
  const concerns: string[] = [];
  if (answers.acne === 'yes') concerns.push('Acne');
  if (answers.aging === 'yes') concerns.push('Aging');
  if (answers.hyperpigmentation === 'yes') concerns.push('Hyperpigmentation');
  if (answers.sensitivity === 'yes') concerns.push('Sensitivity');
  return concerns;
}

function assessSensitivity(answers: Record<string, string>): string {
  if (answers.sensitivity === 'yes') return 'High';
  if (answers.reactions === 'sometimes') return 'Moderate';
  return 'Low';
}

function generateRoutine(skinType: string, concerns: string[], sensitivity: string): string {
  // Generate personalized skincare routine based on assessment
  let routine = `Based on your ${skinType.toLowerCase()} skin type`;
  if (concerns.length > 0) {
    routine += ` and concerns (${concerns.join(', ')})`;
  }
  routine += `, here's your recommended routine:\n\n`;
  
  // Add morning routine
  routine += `Morning:\n`;
  routine += `1. Gentle cleanser\n`;
  if (skinType !== 'Oily') routine += `2. Hydrating toner\n`;
  routine += `3. Treatment serum\n`;
  routine += `4. Moisturizer\n`;
  routine += `5. Sunscreen\n\n`;
  
  // Add evening routine
  routine += `Evening:\n`;
  routine += `1. Oil cleanser\n`;
  routine += `2. Gentle cleanser\n`;
  if (skinType !== 'Oily') routine += `3. Hydrating toner\n`;
  routine += `4. Treatment serum\n`;
  routine += `5. Night cream\n`;
  
  return routine;
}

function getRecommendations(skinType: string, concerns: string[], sensitivity: string): string[] {
  const recommendations: string[] = [];
  
  // Add plant recommendations based on skin type and concerns
  if (concerns.includes('Acne')) {
    recommendations.push('Neem - Natural antibacterial properties');
    recommendations.push('Turmeric - Anti-inflammatory benefits');
  }
  
  if (concerns.includes('Aging')) {
    recommendations.push('Gotu Kola - Collagen production');
    recommendations.push('Aloe Vera - Skin regeneration');
  }
  
  if (concerns.includes('Hyperpigmentation')) {
    recommendations.push('Licorice Root - Brightening properties');
    recommendations.push('Turmeric - Natural skin lightening');
  }
  
  if (sensitivity === 'High') {
    recommendations.push('Chamomile - Soothing properties');
    recommendations.push('Calendula - Gentle healing');
  }
  
  return recommendations;
}

export function getEducationalContent(topic: string): string {
  const topics: Record<string, string> = {
    'herbal_ingredients': `Herbal ingredients are natural plant-based compounds used in skincare. They offer various benefits:
- Antioxidants protect against free radicals
- Anti-inflammatory properties reduce redness
- Antimicrobial properties help fight bacteria
- Moisturizing properties hydrate the skin
- Natural exfoliants gently remove dead skin cells`,
    
    'natural_skincare': `Natural skincare focuses on using plant-based ingredients that work in harmony with your skin:
- Gentle and non-irritating
- Rich in vitamins and minerals
- Free from synthetic chemicals
- Environmentally friendly
- Suitable for sensitive skin`,
    
    'skin_health': `Tips for maintaining healthy skin:
1. Stay hydrated - drink plenty of water
2. Protect from sun damage
3. Cleanse gently twice daily
4. Moisturize regularly
5. Get adequate sleep
6. Manage stress
7. Eat a balanced diet
8. Avoid smoking and excessive alcohol`,
    
    'traditional_remedies': `Traditional herbal remedies have been used for centuries:
- Ayurvedic practices from India
- Traditional Chinese Medicine
- Native American healing
- European herbalism
- African traditional medicine
These practices offer time-tested solutions for various skin concerns.`
  };
  
  return topics[topic] || 'Topic not found. Please try another topic.';
}

export interface FeedbackData {
  type: 'complaint' | 'review' | 'return' | 'general';
  content: string;
  rating?: number;
  productId?: string;
  userEmail?: string;
  status: 'pending' | 'resolved' | 'escalated';
}

export interface SupportTicket {
  id: string;
  type: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'escalated';
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  userEmail?: string;
}

const supportTickets: SupportTicket[] = [];

export function createSupportTicket(data: Omit<SupportTicket, 'id' | 'createdAt' | 'status'>): SupportTicket {
  const ticket: SupportTicket = {
    id: generateTicketId(),
    status: 'open',
    createdAt: new Date(),
    ...data
  };
  
  supportTickets.push(ticket);
  return ticket;
}

function generateTicketId(): string {
  return `TKT-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
}

export function processFeedback(feedback: FeedbackData): string {
  // Process feedback based on type
  switch (feedback.type) {
    case 'complaint':
      return handleComplaint(feedback);
    case 'review':
      return handleReview(feedback);
    case 'return':
      return handleReturn(feedback);
    case 'general':
      return handleGeneralFeedback(feedback);
    default:
      return 'Thank you for your feedback. We will review it shortly.';
  }
}

function handleComplaint(feedback: FeedbackData): string {
  // Check if complaint needs escalation
  const needsEscalation = checkForEscalation(feedback.content);
  
  if (needsEscalation) {
    // Create support ticket for complex issues
    createSupportTicket({
      type: 'complaint',
      description: feedback.content,
      priority: 'high',
      userEmail: feedback.userEmail
    });
    
    return `I apologize for the inconvenience. Your complaint has been escalated to our customer service team. They will contact you shortly at ${feedback.userEmail || 'your provided email'}.`;
  }
  
  // Handle basic complaints
  return `Thank you for bringing this to our attention. We understand your concern and will address it promptly. Our team will review your feedback and take necessary actions.`;
}

function handleReview(feedback: FeedbackData): string {
  if (!feedback.rating) {
    return 'Thank you for your review. Your feedback helps us improve our products and services.';
  }
  
  // Process product review
  const rating = feedback.rating;
  let response = 'Thank you for your review! ';
  
  if (rating >= 4) {
    response += 'We\'re glad you had a positive experience with our product.';
  } else if (rating >= 2) {
    response += 'We appreciate your feedback and will use it to improve our product.';
  } else {
    response += 'We\'re sorry to hear that. Our team will review your feedback to improve our product.';
  }
  
  return response;
}

function handleReturn(feedback: FeedbackData): string {
  // Create return request ticket
  createSupportTicket({
    type: 'return',
    description: feedback.content,
    priority: 'medium',
    userEmail: feedback.userEmail
  });
  
  return `Your return request has been received. Our customer service team will contact you at ${feedback.userEmail || 'your provided email'} with instructions for processing your return.`;
}

function handleGeneralFeedback(feedback: FeedbackData): string {
  return 'Thank you for your feedback. We value your input and will use it to improve our services.';
}

function checkForEscalation(content: string): boolean {
  // Keywords that might indicate need for escalation
  const escalationKeywords = [
    'urgent', 'emergency', 'broken', 'damaged', 'not working',
    'refund', 'money back', 'legal', 'lawyer', 'attorney',
    'complaint', 'unhappy', 'dissatisfied', 'terrible', 'worst'
  ];
  
  const contentLower = content.toLowerCase();
  return escalationKeywords.some(keyword => contentLower.includes(keyword));
}

export interface SkincareQuery {
  type: 'condition' | 'ingredient' | 'routine' | 'remedy' | 'general';
  topic: string;
  context?: string;
}

export function handleSkincareQuery(query: SkincareQuery): string {
  // Split the query into multiple topics if it contains multiple concerns
  const topics = query.topic.toLowerCase().split(/[,&and]+/).map(t => t.trim());
  const context = query.context?.toLowerCase() || '';
  
  // Check if this is a follow-up question about previous treatments
  const isFollowUp = context.includes('used') || context.includes('tried') || 
                    context.includes('before') || context.includes('didn\'t work');
  
  let response = '';
  
  // Handle multiple topics
  for (const topic of topics) {
    let topicResponse = '';
    
    // Check for condition-related keywords
    if (topic.includes('acne') || topic.includes('pimple') || topic.includes('breakout')) {
      topicResponse = handleSkinCondition({ ...query, topic: 'acne' });
    } else if (topic.includes('dark circle') || topic.includes('dark circles') || topic.includes('under eye')) {
      topicResponse = handleSkinCondition({ ...query, topic: 'dark circles' });
    } else if (topic.includes('wrinkle') || topic.includes('fine line')) {
      topicResponse = handleSkinCondition({ ...query, topic: 'wrinkles' });
    } else if (topic.includes('eczema') || topic.includes('dermatitis')) {
      topicResponse = handleSkinCondition({ ...query, topic: 'eczema' });
    } else if (topic.includes('psoriasis')) {
      topicResponse = handleSkinCondition({ ...query, topic: 'psoriasis' });
    } else if (topic.includes('rosacea')) {
      topicResponse = handleSkinCondition({ ...query, topic: 'rosacea' });
    }
    
    // Check for ingredient-related keywords
    if (topic.includes('neem') || topic.includes('azadirachta')) {
      topicResponse = handleIngredientQuery({ ...query, topic: 'neem' });
    } else if (topic.includes('aloe') || topic.includes('aloe vera')) {
      topicResponse = handleIngredientQuery({ ...query, topic: 'aloe vera' });
    } else if (topic.includes('turmeric') || topic.includes('curcumin')) {
      topicResponse = handleIngredientQuery({ ...query, topic: 'turmeric' });
    } else if (topic.includes('tea tree')) {
      topicResponse = handleIngredientQuery({ ...query, topic: 'tea tree' });
    }
    
    // If this is a follow-up about a treatment not working
    if (isFollowUp && topicResponse) {
      topicResponse += `\n\nSince you mentioned this treatment didn't work for you, here are some alternative approaches:\n`;
      
      if (topic.includes('neem')) {
        topicResponse += `Alternative to Neem:\n`;
        topicResponse += `1. Try Tea Tree Oil: Similar antibacterial properties but different active compounds\n`;
        topicResponse += `2. Consider Turmeric: Natural anti-inflammatory that works well for many skin types\n`;
        topicResponse += `3. Aloe Vera: Gentle and soothing, especially good for sensitive skin\n`;
        topicResponse += `4. Honey: Natural antibacterial with additional moisturizing benefits\n`;
      } else if (topic.includes('acne')) {
        topicResponse += `Alternative Acne Treatments:\n`;
        topicResponse += `1. Salicylic Acid: Exfoliates and unclogs pores\n`;
        topicResponse += `2. Benzoyl Peroxide: Kills bacteria that cause acne\n`;
        topicResponse += `3. Retinoids: Increase cell turnover and prevent clogged pores\n`;
        topicResponse += `4. Sulfur: Dries out pimples and absorbs excess oil\n`;
      } else if (topic.includes('dark circle')) {
        topicResponse += `Alternative Dark Circle Treatments:\n`;
        topicResponse += `1. Vitamin C: Brightens and reduces pigmentation\n`;
        topicResponse += `2. Caffeine: Reduces puffiness and improves circulation\n`;
        topicResponse += `3. Retinol: Increases collagen production and cell turnover\n`;
        topicResponse += `4. Hyaluronic Acid: Plumps skin and reduces the appearance of shadows\n`;
      }
      
      topicResponse += `\nRemember: Skin reactions vary by individual. It's important to patch test new ingredients and give treatments time to work (usually 4-6 weeks).`;
    }
    
    if (topicResponse) {
      response += (response ? '\n\n' : '') + topicResponse;
    }
  }
  
  // If no specific topics were matched, provide a general response
  if (!response) {
    response = `I understand you're asking about "${query.topic}". Could you please provide more details about your specific skin concern? For example:
- What symptoms are you experiencing?
- How long have you had this issue?
- What have you tried so far?
- Are you experiencing any irritation or sensitivity?

This will help me provide more targeted advice for your situation.`;
  }
  
  return response;
}

function handleSkinCondition(query: SkincareQuery): string {
  const condition = query.topic.toLowerCase();
  
  // Check for serious conditions that need medical attention
  const seriousConditions = [
    'melanoma', 'skin cancer', 'severe infection', 'severe allergic reaction',
    'severe burn', 'severe wound', 'severe rash', 'severe acne'
  ];
  
  if (seriousConditions.some(cond => condition.includes(cond))) {
    return `I notice you're asking about ${query.topic}. This is a serious condition that requires immediate medical attention. While natural remedies can be helpful for some skin conditions, please consult a healthcare professional first. They can provide proper diagnosis and treatment.`;
  }

  // Provide condition-specific information
  const conditionInfo: Record<string, string> = {
    'acne': `For acne, consider these natural approaches:
1. Tea tree oil (Melaleuca alternifolia) - Natural antibacterial properties
2. Aloe vera - Soothing and anti-inflammatory
3. Green tea - Antioxidant and anti-inflammatory
4. Honey - Natural antibacterial and healing properties

Precautions:
- Always dilute essential oils
- Patch test before using
- Start with gentle ingredients
- Be consistent with your routine

Remember: Results may take time, and what works for one person may not work for another.`,
    
    'eczema': `For eczema, consider these natural approaches:
1. Colloidal oatmeal - Soothing and anti-inflammatory
2. Calendula - Healing and anti-inflammatory
3. Chamomile - Soothing and calming
4. Coconut oil - Moisturizing and antimicrobial

Precautions:
- Avoid known triggers
- Keep skin moisturized
- Use gentle, fragrance-free products
- Consider food sensitivities

Remember: Eczema can be triggered by various factors. Keep a diary to identify your triggers.`,
    
    'psoriasis': `For psoriasis, consider these natural approaches:
1. Aloe vera - Soothing and healing
2. Tea tree oil - Anti-inflammatory properties
3. Turmeric - Anti-inflammatory benefits
4. Dead Sea salts - Mineral-rich and soothing

Precautions:
- Avoid scratching
- Keep skin moisturized
- Manage stress
- Consider dietary changes

Remember: Psoriasis is a chronic condition that may require medical treatment. These natural approaches can complement your treatment plan.`,
    
    'rosacea': `For rosacea, consider these natural approaches:
1. Green tea - Anti-inflammatory properties
2. Chamomile - Soothing and calming
3. Aloe vera - Gentle and healing
4. Oatmeal - Soothing and anti-inflammatory

Precautions:
- Avoid triggers (spicy foods, alcohol, extreme temperatures)
- Use gentle products
- Protect from sun exposure
- Manage stress

Remember: Rosacea is a chronic condition that requires gentle care and trigger management.`
  };

  // Find matching condition or provide general advice
  const matchingCondition = Object.keys(conditionInfo).find(key => 
    condition.includes(key)
  );

  if (matchingCondition) {
    return conditionInfo[matchingCondition];
  }

  return `For ${query.topic}, consider these general approaches:
1. Gentle cleansing
2. Proper moisturization
3. Sun protection
4. Stress management
5. Healthy diet

Precautions:
- Always patch test new products
- Start with gentle ingredients
- Be consistent with your routine
- Monitor for any adverse reactions

Remember: If symptoms persist or worsen, please consult a healthcare professional.`;
}

function handleIngredientQuery(query: SkincareQuery): string {
  const ingredient = query.topic.toLowerCase();
  
  const ingredientInfo: Record<string, string> = {
    'aloe vera': `Aloe Vera (Aloe barbadensis miller):
Properties:
- Soothing and cooling
- Anti-inflammatory
- Wound healing
- Moisturizing

Benefits:
- Soothes sunburn
- Reduces inflammation
- Promotes wound healing
- Provides lightweight hydration

Precautions:
- Some people may be allergic
- Use fresh gel or high-quality products
- Avoid if you have latex allergy
- Don't use on deep wounds

Usage:
- Apply fresh gel directly
- Use in DIY masks
- Add to moisturizers
- Use as a spot treatment`,
    
    'tea tree': `Tea Tree Oil (Melaleuca alternifolia):
Properties:
- Antimicrobial
- Anti-inflammatory
- Antifungal
- Antiseptic

Benefits:
- Helps with acne
- Fights fungal infections
- Reduces inflammation
- Natural preservative

Precautions:
- Always dilute (1-2% in carrier oil)
- Never use undiluted
- Some people may be sensitive
- Keep away from eyes

Usage:
- Add to carrier oils
- Use in spot treatments
- Add to cleansers
- Use in masks`,
    
    'turmeric': `Turmeric (Curcuma longa):
Properties:
- Anti-inflammatory
- Antioxidant
- Antimicrobial
- Skin brightening

Benefits:
- Reduces inflammation
- Brightens skin
- Helps with acne
- Anti-aging properties

Precautions:
- Can stain skin temporarily
- Some people may be sensitive
- Use in moderation
- Avoid if you have sensitive skin

Usage:
- Add to face masks
- Use in DIY treatments
- Combine with honey
- Use with carrier oils`,
    
    'honey': `Honey:
Properties:
- Antimicrobial
- Humectant
- Anti-inflammatory
- Healing

Benefits:
- Moisturizes skin
- Fights bacteria
- Soothes inflammation
- Promotes healing

Precautions:
- Some people may be allergic
- Use raw, unprocessed honey
- Avoid if you have bee allergies
- Don't use on open wounds

Usage:
- Use as a mask
- Add to cleansers
- Use as a spot treatment
- Combine with other ingredients`
  };

  // Find matching ingredient or provide general information
  const matchingIngredient = Object.keys(ingredientInfo).find(key => 
    ingredient.includes(key)
  );

  if (matchingIngredient) {
    return ingredientInfo[matchingIngredient];
  }

  return `For ${query.topic}, here are some general guidelines:
1. Always research ingredients thoroughly
2. Check for potential allergies
3. Start with small amounts
4. Monitor skin reactions
5. Consider interactions with other ingredients

Remember: Natural doesn't always mean safe. Always patch test new ingredients and consult a healthcare professional if you have concerns.`;
}

function handleRoutineQuery(query: SkincareQuery): string {
  const context = query.context?.toLowerCase() || '';
  
  // Determine skin type from context
  let skinType = 'normal';
  if (context.includes('oily')) skinType = 'oily';
  if (context.includes('dry')) skinType = 'dry';
  if (context.includes('combination')) skinType = 'combination';
  if (context.includes('sensitive')) skinType = 'sensitive';
  
  const routines: Record<string, string> = {
    'oily': `Morning Routine for Oily Skin:
1. Gentle cleanser (avoid harsh scrubs)
2. Alcohol-free toner (optional)
3. Lightweight serum (vitamin C or niacinamide)
4. Oil-free moisturizer
5. Non-comedogenic sunscreen

Evening Routine:
1. Oil cleanser (if wearing makeup)
2. Gentle cleanser
3. Treatment serum (retinol or salicylic acid)
4. Lightweight moisturizer

Additional Tips:
- Use clay masks 1-2 times per week
- Avoid heavy creams
- Look for non-comedogenic products
- Don't skip moisturizer
- Use blotting papers if needed`,
    
    'dry': `Morning Routine for Dry Skin:
1. Gentle, creamy cleanser
2. Hydrating toner
3. Hyaluronic acid serum
4. Rich moisturizer
5. Sunscreen

Evening Routine:
1. Oil cleanser (if wearing makeup)
2. Gentle, creamy cleanser
3. Hydrating toner
4. Treatment serum
5. Rich night cream
6. Face oil (optional)

Additional Tips:
- Use gentle, non-foaming cleansers
- Apply products to damp skin
- Layer products from thinnest to thickest
- Use occlusive ingredients at night
- Avoid hot water`,
    
    'combination': `Morning Routine for Combination Skin:
1. Gentle cleanser
2. Balancing toner
3. Lightweight serum
4. Lightweight moisturizer (focus on dry areas)
5. Sunscreen

Evening Routine:
1. Oil cleanser (if wearing makeup)
2. Gentle cleanser
3. Treatment serum
4. Lightweight moisturizer (focus on dry areas)

Additional Tips:
- Use different products for different areas
- Apply heavier products to dry areas
- Use lighter products on oily areas
- Consider seasonal changes
- Use gentle exfoliation 1-2 times per week`,
    
    'sensitive': `Morning Routine for Sensitive Skin:
1. Gentle, fragrance-free cleanser
2. Soothing toner (optional)
3. Gentle serum
4. Fragrance-free moisturizer
5. Mineral sunscreen

Evening Routine:
1. Gentle, fragrance-free cleanser
2. Soothing toner (optional)
3. Gentle treatment (if tolerated)
4. Fragrance-free moisturizer

Additional Tips:
- Avoid fragrances and essential oils
- Patch test all new products
- Introduce one new product at a time
- Use minimal products
- Avoid harsh scrubs and acids`
  };

  return routines[skinType] || `Here's a basic skincare routine:
Morning:
1. Gentle cleanser
2. Toner (optional)
3. Serum
4. Moisturizer
5. Sunscreen

Evening:
1. Oil cleanser (if wearing makeup)
2. Gentle cleanser
3. Treatment serum
4. Moisturizer

Additional Tips:
- Cleanse twice daily
- Always wear sunscreen
- Stay hydrated
- Get enough sleep
- Manage stress

Remember: Adjust your routine based on your skin's needs and reactions.`;
}

function handleRemedyQuery(query: SkincareQuery): string {
  const remedy = query.topic.toLowerCase();
  
  const remedyInfo = `Natural Remedies for Common Skin Concerns:

1. Acne:
- Honey and cinnamon mask
- Tea tree oil spot treatment
- Green tea toner
- Aloe vera gel

2. Dry Skin:
- Oatmeal and honey mask
- Coconut oil moisturizer
- Avocado mask
- Shea butter treatment

3. Dark Spots:
- Lemon juice and honey
- Turmeric and yogurt mask
- Papaya enzyme treatment
- Vitamin C serum

4. Wrinkles:
- Aloe vera and vitamin E
- Honey and egg white mask
- Green tea compress
- Rosehip oil treatment

5. Sunburn:
- Aloe vera gel
- Oatmeal bath
- Cucumber slices
- Green tea compress

Precautions:
- Always patch test
- Use fresh ingredients
- Store properly
- Follow proper hygiene
- Monitor for reactions

Remember: Natural remedies can be effective but may take time to show results. Be consistent and patient.`;

  // Check for specific remedy requests
  if (remedy.includes('mask') || remedy.includes('treatment')) {
    return `Here's a simple DIY ${query.topic}:

Ingredients:
- 1 tbsp honey
- 1 tbsp yogurt
- 1 tsp turmeric
- 1 tsp oatmeal

Instructions:
1. Mix all ingredients
2. Apply to clean skin
3. Leave for 10-15 minutes
4. Rinse with warm water
5. Follow with moisturizer

Precautions:
- Patch test first
- Use fresh ingredients
- Don't leave on too long
- Rinse thoroughly
- Follow with moisturizer

Remember: DIY treatments should be used immediately and not stored.`;
  }

  return remedyInfo;
}

function handleGeneralSkincareQuery(query: SkincareQuery): string {
  return `Here are some general skincare tips:

1. Basic Principles:
- Cleanse gently
- Moisturize regularly
- Protect from sun
- Stay hydrated
- Get enough sleep

2. Product Selection:
- Choose gentle products
- Look for non-comedogenic options
- Avoid harsh ingredients
- Consider your skin type
- Read ingredient labels

3. Lifestyle Factors:
- Manage stress
- Eat a balanced diet
- Exercise regularly
- Avoid smoking
- Limit alcohol

4. Seasonal Care:
- Adjust routine for weather
- Use heavier moisturizers in winter
- Increase sun protection in summer
- Consider humidity levels
- Protect from environmental factors

Remember: Good skincare is about consistency and listening to your skin's needs.`;
} 