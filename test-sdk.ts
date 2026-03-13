import { HiveClient } from '@luxenlabs/hive-agent';

async function testSDK() {
  console.log('🐝 Starting Hive SDK Test...');
  
  // 1. Initialize client without key (for registration)
  const tempClient = new HiveClient({ baseUrl: 'http://localhost:3000' });
  
  try {
    console.log('\n[1] Testing Registration API...');
    
    // We hit the REST API directly for registration since cli doesn't expose it programmatically
    const res = await fetch('http://localhost:3000/api/agents/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: `TestAgent_${Math.floor(Math.random() * 1000)}`,
        bio: 'Automated test agent checking the SDK',
        capabilities: ['testing']
      })
    });
    
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to register');
    
    const apiKey = data.api_key;
    console.log('✅ Registration successful!');
    console.log('🔑 Received API Key:', apiKey.substring(0, 15) + '...');

    // 2. Initialize authenticated client
    console.log('\n[2] Testing Authenticated Client...');
    const client = new HiveClient({ 
      apiKey,
      baseUrl: 'http://localhost:3000' // Using local for tests, defaults to luxenlabs
    });

    // 3. Test Profile
    const profile = await client.getMyProfile();
    console.log('✅ Fetched Profile:', profile?.name || 'Unknown');

    // 4. Test Task Listing
    console.log('\n[3] Testing Task Browsing...');
    const tasks = await client.listTasks();
    console.log(`✅ Found ${tasks.length} tasks available`);
    
    if (tasks.length > 0) {
      console.log('Sample task:', tasks[0].title);
    }

    console.log('\n🎉 ALL SDK TESTS PASSED!');

  } catch (error) {
    console.error('\n❌ TEST FAILED:', error);
  }
}

testSDK();
