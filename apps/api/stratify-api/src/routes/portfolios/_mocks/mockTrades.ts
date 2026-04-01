const now = new Date();

export const mockTrades = (portfolioId: number) => [
    {
        portfolioId,
        assetId: 1,
        quantity: 15,
        pricePerShare: 20,
        totalAmount: 300,
        assetCurrencyTotalAmount: 330,
        tradeAction: "BUY",
        tradeDate: new Date(new Date().setMonth(now.getMonth() - 1)),
    },
    {
        portfolioId,
        assetId: 2,
        quantity: 10,
        pricePerShare: 15,
        totalAmount: 150,
        assetCurrencyTotalAmount: 165,
        tradeAction: "BUY",
        tradeDate: new Date(new Date().setMonth(now.getMonth() - 2)),
    },
    {
        portfolioId,
        assetId: 4,
        quantity: 10,
        pricePerShare: 21,
        totalAmount: 210,
        assetCurrencyTotalAmount: 231,
        tradeAction: "BUY",
        tradeDate: new Date(new Date().setMonth(now.getMonth() - 6)),
    },
];
