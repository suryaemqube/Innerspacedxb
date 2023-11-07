import React from "react";
import { graphql } from "gatsby";
import Seo from "../components/SeoMeta";
import Layout from "../components/Layout";

const PrivacyPolicy = ({ data }) => {
    const WEBSITE_URL = process.env.GATSBY_BASE_URL;
    const MEDIA_URL = process.env.GATSBY_MEDIA_URL;
    const page = data?.wpPage || [];

    return (
        <>
            <Layout>
                <Seo pageUrl={`${WEBSITE_URL}/privacy-policy/`} bodyClass={`privacy-policy`} />
                <section class="header-image">
                    <h1>{page && page.title}</h1>
                </section>

                <section class="main-content our-story">
                    {page &&
                        <div class="container about-innerspace" dangerouslySetInnerHTML={{ __html: page.privacyPolicy.topText }} />
                    }

                </section>
            </Layout>

        </>
    );
};

export default PrivacyPolicy;
export const data = graphql`
query MyQuery {
  wpPage(databaseId: {eq: 3 }) {
    id
    title
    content
    privacyPolicy{
        topText
    }
  }
}
`;