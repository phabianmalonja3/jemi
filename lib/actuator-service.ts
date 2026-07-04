const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/actuator`;

export const fetchActuatorData = async (endpoint: string) => {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      cache: 'no-store', // Muhimu ili kupata data mpya kila wakati
    });
    if (!response.ok) throw new Error("Network response was not ok");
    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    return null;
  }
};