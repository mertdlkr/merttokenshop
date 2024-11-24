
import React, { useState, useEffect } from 'react';
import { backend } from 'declarations/backend';

const TokenMarketplace = () => {
  const [activeTab, setActiveTab] = useState('browse');
  const [loading, setLoading] = useState(false);
  const [tokens, setTokens] = useState([]);
  const [notification, setNotification] = useState(null);

  // Form states
  const [createTokenForm, setCreateTokenForm] = useState({
    name: '',
    description: '',
    initialSupply: '',
  });

  const [buyForm, setBuyForm] = useState({
    tokenId: '',
    quantity: '',
  });

  // Fetch tokens when the component mounts
  useEffect(() => {
    fetchListedTokens();
  }, []);

const fetchListedTokens = async () => {
    setLoading(true);
    try {
        const listedTokens = await backend.getListedTokens();
        setTokens(listedTokens);
    } catch (error) {
        console.error('Error fetching tokens:', error);
        setNotification('Failed to fetch tokens. Please try again.');
    } finally {
        setLoading(false);
    }
};


  const handleCreateToken = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!createTokenForm.name || !createTokenForm.description || !createTokenForm.initialSupply) {
        throw new Error('Please fill all fields');
      }

      const result = await backend.createToken(
        createTokenForm.name,
        createTokenForm.description,
        Number(createTokenForm.initialSupply)
      );

      if (result.ok) {
        setNotification('Token created successfully!');
        setCreateTokenForm({ name: '', description: '', initialSupply: '' });
        setActiveTab('browse');
        await fetchListedTokens();
      } else {
        setNotification('Error creating token.');
      }
    } catch (error) {
      console.error('Error creating token:', error);
      setNotification('Error creating token: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBuyToken = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { tokenId, quantity } = buyForm;
      if (!tokenId || !quantity) {
        throw new Error('Please fill all fields');
      }

      const result = await backend.buyTokens(Number(tokenId), Number(quantity));
      if (result.ok) {
        setNotification('Tokens purchased successfully!');
        setBuyForm({ tokenId: '', quantity: '' });
        await fetchListedTokens();
      } else {
        setNotification('Error buying tokens.');
      }
    } catch (error) {
      console.error('Error buying tokens:', error);
      setNotification('Error buying tokens: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const TabButton = ({ name, label }) => (
    <button
      onClick={() =>  {
        setActiveTab(name);
        fetchListedTokens();}}
      className={`px-4 py-2 rounded-lg font-medium ${
        activeTab === name ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
      }`}
    >
      {label}
    </button>
  );

 const TokenCard = ({ token }) => (
  <div className="bg-white rounded-lg shadow-md p-4 space-y-3">
    <h3 className="font-semibold text-lg">{token.name}</h3>
    <p className="text-gray-600 text-sm">{token.description}</p>
    <p className="text-sm">Price: {token.price || 'N/A'} ICP</p>
    <p className="text-sm">Available: {token.availableSupply || 'N/A'}</p>
  </div>
);


 const CreateTokenForm = () => (
    <form onSubmit={handleCreateToken} className="space-y-4">
        <label>
            Token Name:
            <input
                type="text"
                value={createTokenForm.name}
                onChange={(e) => setCreateTokenForm({ ...createTokenForm, name: e.target.value })}
            />
        </label>
        <label>
            Description:
            <input
                type="text"
                value={createTokenForm.description}
                onChange={(e) => setCreateTokenForm({ ...createTokenForm, description: e.target.value })}
            />
        </label>
        <label>
            Initial Supply:
            <input
                type="number"
                value={createTokenForm.initialSupply}
                onChange={(e) =>
                    setCreateTokenForm({ ...createTokenForm, initialSupply: e.target.value })
                }
            />
        </label>
        <label>
            Price (optional):
            <input
                type="number"
                value={createTokenForm.price || ''}
                onChange={(e) =>
                    setCreateTokenForm({ ...createTokenForm, price: e.target.value ? Number(e.target.value) : null })
                }
            />
        </label>
        <button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Token'}
        </button>
    </form>
);

  const BrowseTokens = () => (
    <div>
      {loading ? (
        <p>Loading tokens...</p>
      ) : tokens.length > 0 ? (
        <div className="grid gap-4">
          {tokens.map((token, index) => (
            <TokenCard key={index} token={token} />
          ))}
        </div>
      ) : (
        <p>No tokens found. Create one to start!</p>
      )}
    </div>
  );

  return (
    <div>
      <header className="flex space-x-4 p-4 bg-gray-200">
        <TabButton name="browse" label="Browse Tokens" />
        <TabButton name="create" label="Create Token" />
        <TabButton name="buy" label="Buy Token" />
      </header>

      {notification && <div className="p-4 text-center bg-yellow-100">{notification}</div>}

      <main className="p-4">
        {activeTab === 'browse' && <BrowseTokens />}
        {activeTab === 'create' && <CreateTokenForm />}
        {activeTab === 'buy' && <div>Buy Token form goes here</div>}
      </main>
    </div>
  );
};

export default TokenMarketplace;