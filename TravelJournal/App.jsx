import { useState } from 'react'
import Header from './Components/Header'
import Entry from './Components/Entry'

export default function App() {
  return (
    <>
      <Header />
      <Entry image={{src:"./Japan.jpg", alt:"Mount Fuji"}} 
      country="Japan"
      hrefs="https://share.google/BoBTS0IypoywlueP4"
      links="View on Google Maps" 
      date="12 Sep 2026 - 24 Sep 2026"
      cs="Mount Fuji is the tallest mountain in Japan, standing at 3,776 metres (12,380 fit).
                It is the single most popular tourist attraction in Japan, for both local and foreign tourists."
                />
      <Entry image={{src:"./Sydney.jpeg", alt:"Opera House"}} 
        country="Australia"
      hrefs="https://www.google.com/maps/search/Sydney+Opera+House"
      links="View on Google Maps" 
      date="14 Sep 2026 - 24 Sep 2026"
      cs="The Sydney Opera House is a world-renowned multi-venue performing arts centre and a UNESCO World Heritage site. It is the most famous 
      tourist destination of Australia ."
                />
      <Entry image={{src:"./Norway.png", alt:"geirangerfjord"}} 
      country="Norway"
      hrefs="https://share.google/RnS6hgjDoCMLjnoBl"
      links="View on Google Maps" 
      date="10 Sep 2026 - 25 Sep 2026"
      cs="The Geirangerfjord is a deep-blue, 15-kilometre-long branch of the Storfjord located in southwestern Norway's 
      Sunnmøre region. Jointly inscribed as a UNESCO World Heritage Site alongside Nærøyfjord, 
      it is widely considered one of the most scenic and architecturally dramatic fjord landscapes in the world. 
      The fjord is renowned for its sheer granite walls that rise up to 1,400 metres high, plunging waterfalls, 
      and historic, abandoned mountain farms clinging to steep cliffs."
                />
    </>
  )
}

