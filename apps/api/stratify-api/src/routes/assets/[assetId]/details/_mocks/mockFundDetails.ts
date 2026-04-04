export const mockFundDetailsResponse = {
    data: {
        data: {
            shortName: "A Fund",
            longName: "An Index Fund",
            symbol: "FUND",
            type: "ETF",
            fundFamily: "S&P",
            marketState: "REGULAR",
            currency: "USD",
            exchange: {
                exchangeName: "A stock exchange",
                exchangeTimezone: "EST",
            },
            priceDetails: {
                currentPrice: 450.25,
                dayTradingActivity: {
                    open: 448.0,
                    high: 452.0,
                    low: 447.5,
                    close: 449.0,
                    volume: 1200000,
                    change: 1.25,
                    changePercent: 0.28,
                },
            },
            sectorWeights: [
                {
                    sector: "technology",
                    weight: 0.95,
                },
                {
                    sector: "communications",
                    weight: 0.02,
                },
                {
                    sector: "energy",
                    weight: 0.02,
                },
                {
                    sector: "financial",
                    weight: 0.01,
                },
            ],
        },
    },
};
