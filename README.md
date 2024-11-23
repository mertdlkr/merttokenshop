<p className="text-sm">Available: {token.availableSupply  'N/A'}</p>
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
                value={createTokenForm.price  ''}
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
