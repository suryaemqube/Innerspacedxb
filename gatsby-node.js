const path = require("path");

exports.createPages = async ({ actions, graphql }) => {
  const { createPage, createRedirect, createSlice } = actions;

  const identity = await graphql(`
    query MyQuery {
      allWpPage(filter: { databaseId: { eq: 11 } }) {
        nodes {
          id
          uri
          wpChildren {
            nodes {
              slug
              databaseId
              uri
            }
          }
        }
      }
    }
  `);

  const brands = await graphql(`
    query MyQuery {
      allWpPage(filter: { template: { templateName: { eq: "Brands" } } }) {
        edges {
          node {
            id
            uri
            databaseId
            slug
          }
        }
      }
    }
  `);
  const roomTypes = await graphql(`
    query MyQuery {
      allWpPage(
        filter: {
          template: { templateName: { eq: "Room Type" } }
          databaseId: { nin: 31 }
        }
      ) {
        edges {
          node {
            slug
            databaseId
            uri
          }
        }
      }
    }
  `);

  // const portfolio = await graphql(`
  //   query MyQuery {
  //     allWpPortfolio(limit: 9) {
  //       pageInfo {
  //         totalCount
  //       }
  //     }
  //   }
  // `);

  const BlogDetail = await graphql(`
    query MyQuery {
      allWpPost {
        edges {
          node {
            id
            uri
            databaseId
          }
        }
      }
    }
  `);

  const lastDetail = await graphql(`
    query MyQuery {
      allWpLastChance(
        filter: {
          lastChanceSingularPage: { lastChanceSoldOutSelect: { ne: "sold" } }
        }
      ) {
        edges {
          node {
            id
            uri
            databaseId
          }
        }
      }
    }
  `);

  if (identity.errors) {
    throw new Error(identity.errors);
  }

  if (brands.errors) {
    throw new Error(brands.errors);
  }

  if (roomTypes.errors) {
    throw new Error(roomTypes.errors);
  }

  // if (portfolio.errors) {
  //   throw new Error(portfolio.errors);
  // }
  if (BlogDetail.errors) {
    throw new Error(BlogDetail.errors);
  }

  if (lastDetail.errors) {
    throw new Error(lastDetail.errors);
  }

  const identityNode = identity.data?.allWpPage || [];
  const brandsNode = brands.data?.allWpPage.edges || [];
  const roomNode = roomTypes.data?.allWpPage.edges || [];
  // const portfolioPageinfo = portfolio.data?.allWpPortfolio.pageInfo || [];

  const BlogDetailPage = BlogDetail.data?.allWpPost.edges || [];
  const lastDetailPage = lastDetail.data?.allWpLastChance.edges || [];

  identityNode.nodes.forEach(({ wpChildren }) => {
    wpChildren.nodes.forEach((child) => {
      createPage({
        path: `/identity/${child.slug}`,
        component: path.resolve("./src/templates/Identity.js"),
        context: {
          pageId: child.databaseId,
          pageUri: child.uri,
        },
      });
    });
  });

  brandsNode.forEach(({ node }) => {
    createPage({
      path: node.uri,
      component: path.resolve("./src/templates/Brands.js"),
      context: {
        pageId: node.databaseId,
        pageUri: node.uri,
        pageSlug: node.slug,
      },
    });
  });

  roomNode.forEach(({ node }) => {
    createPage({
      path: `/${node.slug}/`,
      component: path.resolve("./src/templates/RoomTypes.js"),
      context: {
        pageId: node.databaseId,
        pageSlug: node.slug,
        pageUri: node.uri
      },
    });
  });

  BlogDetailPage.forEach(({ node }) => {
    createPage({
      path: node.uri,
      component: path.resolve("./src/templates/BlogDetailPage.js"),
      context: {
        pageId: node.databaseId,
        pageUri: node.uri,
      },
    });
  });

  lastDetailPage.forEach(({ node }) => {
    createPage({
      path: node.uri,
      component: path.resolve("./src/templates/LastChancePage.js"),
      context: {
        pageId: node.databaseId,
        pageUri: node.uri,
      },
    });
  });
  // const postsPerPage = 9;
  // const numPages = Math.ceil(portfolioPageinfo.totalCount / postsPerPage);

  // Array.from({ length: numPages }).forEach((_, i) => {
  //   createPage({
  //     path: i === 0 ? `/portfolio/` : `/portfolio/page/${i + 1}`,
  //     component: path.resolve("./src/templates/PortfolioList.js"),
  //     context: {
  //       limit: postsPerPage,
  //       skip: i * postsPerPage,
  //       numPages,
  //       currentPage: i + 1,
  //     },
  //   });
  // });

  createRedirect({
    fromPath: "/identity/",
    toPath: "/identity/our-story/",
    isPermanent: true,
    redirectInBrowser: true,
  });

  createSlice({
    id: `navigation-bar`,
    component: require.resolve(`./src/components/Navbar.js`),
  });

  createSlice({
    id: `footer`,
    component: require.resolve(`./src/components/Footer.js`),
  });
};
