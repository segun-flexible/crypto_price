const puppeteer = require("puppeteer");
const express = require("express");
const app = express();


app.get("/coins", async (req, res) => {

    try {

		const interates = 3;

		//let URL = "https://www.coingecko.com/";
		const browser = await puppeteer.launch({
            headless:false,
            args: ["--no-sandbox"]
        });
		const page = await browser.newPage();

        let results,finalResult = [];

        for(i=1; i <= interates; i++){

            let URL = `https://www.coingecko.com/?page=${i}`

            await page.goto(URL,{timeout:0, waitUntil: "domcontentloaded"});
            await page.waitForSelector('nav.pagy-bootstrap-nav', { visible: true, timeout: 0 });
            //console.log(URL)
            

            results = await page.evaluate( ()=>{
			
                document.querySelector("nav.pagy-bootstrap-nav").scrollIntoView()
    
                const data = [];
    
                document.querySelectorAll(".coin-table table tbody tr").forEach(coin =>{

                    data.push({
                        img: coin.querySelector("img").src,
                        name: coin.querySelector(".tw-hidden").textContent.trim(),
                        abbr: coin.querySelector("span").textContent.trim(),
                        price: coin.querySelector(".no-wrap").textContent.trim(),
                        change1h: coin.querySelector(".td-change1h.change1h.stat-percent").textContent.trim(),
                        change24h: coin.querySelector(".td-change24h.change24h.stat-percent").textContent.trim(),
                        change7d: coin.querySelector(".td-change7d.change7d.stat-percent").textContent.trim(),
                        dailyVolumes: coin.querySelector(".td-liquidity_score.lit").textContent.trim(),
                        mcap: coin.querySelector(".td-market_cap.cap.col-market.cap-price").textContent.trim()
                    })

                    

                })
    

                

                return data

            })
            
            finalResult.push([...finalResult,...results])

            
            
        }
		

        res.json([].concat.apply([], finalResult))

		await browser.close()

        

	
	} catch (error) {
		console.log(error,"freom, err");
		return res.json({ message: error.message,text:error });
	}

})


app.listen(process.env.PORT || 3000, () => console.log("App Started"));