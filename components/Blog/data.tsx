// data/blogPosts.ts

// 1. Define an interface for your blog post structure
export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
}

// 2. Create an array of BlogPost objects
export const blogPosts: BlogPost[] = [
  {
    slug: "5-essential-workouts-for-busy-travelers",
    title: "5 Essential Workouts for Busy Travelers",
    excerpt: "Short, effective routines to keep you in shape on the go.",
    content: `
      <p>Traveling can throw off your fitness routine, but it doesn't have to. Here are 5 quick workouts you can do with minimal equipment:</p>
      <ol>
        <li><strong>Bodyweight HIIT:</strong> Burpees, squat jumps, and mountain climbers for 20 seconds each, resting 10 seconds in between.</li>
        <li><strong>Chair & Desk Circuit:</strong> Chair dips, desk push-ups, and plank holds using hotel furniture.</li>
        <li><strong>Full-Body Tabata:</strong> Alternate lunges and push-ups for 8 rounds of 20 seconds on, 10 seconds off.</li>
        <li><strong>Core Crusher:</strong> Bicycle crunches, forearm planks, and side planks, each for 30 seconds.</li>
        <li><strong>Resistance Bands:</strong> Pack a lightweight band for rows, bicep curls, and shoulder presses.</li>
      </ol>
      <p>Incorporating any of these five workouts into your day—morning, noon, or night—keeps your routine on track and your body in shape.</p>
    `,
  },
  {
    slug: "keep-your-diet-on-track-while-on-the-road",
    title: "How to Keep Your Diet on Track While on the Road",
    excerpt: "Practical meal planning and snack options for the busy traveler.",
    content: `
      <p>Travel can make healthy eating feel like a challenge, but a little planning goes a long way:</p>
      <ul>
        <li><strong>Pack Healthy Snacks:</strong> Choose nuts, dried fruit, or protein bars to curb hunger between meals.</li>
        <li><strong>Meal Prepping:</strong> If you have access to a kitchenette, cook in batches to avoid fast-food pitfalls.</li>
        <li><strong>Smart Restaurant Choices:</strong> Look for grilled items, salads, and vegetable-based dishes over fried or creamy options.</li>
        <li><strong>Stay Hydrated:</strong> Dehydration can lead to cravings, so keep a refillable water bottle handy.</li>
      </ul>
      <p>Whether you're flying cross-country or road-tripping to a new destination, these tips help you maintain a balanced diet on the go.</p>
    `,
  },
  {
    slug: "best-gym-hacks-for-travelers",
    title: "Best Gym Hacks: From Minimal Equipment to Quick Routines",
    excerpt: "Top tips to get the most out of your travel-friendly workouts.",
    content: `
      <p>Limited gym access or lack of time shouldn’t stop you from working out while traveling. Here are a few hacks to help you hit your fitness goals:</p>
      <ol>
        <li><strong>Use What You Have:</strong> If the hotel gym only has a treadmill and a few dumbbells, focus on high-intensity combos (like sprint intervals + weighted lunges).</li>
        <li><strong>Time Blocking:</strong> Schedule a 20-minute block first thing in the morning to ensure you get a workout before the day's activities begin.</li>
        <li><strong>Pack Lightweight Gear:</strong> Resistance bands and jump ropes are easy to carry and can give you a full-body workout.</li>
        <li><strong>Track Your Progress:</strong> Use a fitness app or simple notebook to log exercises and keep motivated.</li>
      </ol>
      <p>By implementing these simple hacks, you'll stay consistent with your fitness routine, even when your schedule is anything but predictable.</p>
    `,
  },
];
