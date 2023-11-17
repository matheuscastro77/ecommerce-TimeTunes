import React from 'react'
import { createClient } from 'next-sanity';
import { apiVersion, dataset, projectId, useCdn } from '../sanity/env'
import Head from 'next/head';
import { HeroBanner, FooterBanner, Product } from '../components';

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn,
  token: process.env.NEXT_PUBLIC_SANITY_TOKEN
});

const Home = ({ products, bannerData }) => {
  return (
    <div>
      <Head>
        <title>Time Tunes</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <HeroBanner heroBanner={bannerData.length && bannerData[0]} />
      {console.log(bannerData)}
      <div className="products-heading">
        <h2>Produtos Mais Vendidos</h2>
      </div>

      <div className="products-container">
        {products?.map((product) => <Product key={product._id} product={product} />)}
      </div>

      <FooterBanner footerBanner={bannerData && bannerData[1]} />
    </div>
  )
}
export const getServerSideProps = async () => {
  const query = '*[_type == "product"]';
  const products = await client.fetch(query);

  const bannerQuery = '*[_type == "banner"]';
  const bannerData = await client.fetch(bannerQuery);
  return {
    props: { products, bannerData }
  }

}

export default Home