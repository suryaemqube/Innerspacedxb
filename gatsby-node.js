const path = require("path");
const redirects = require("./redirects.json");

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

  const mobileMenu = await graphql(`
    query MyQuery {
      wpMenu(name: {eq: "Mobile-menu"}) {
        id
        menuItems {
          nodes {
            id
            label
            path
            parentId
            cssClasses
          }
        }
      }
    }
  `);

  const primary  = await graphql(`
    query MyQuery {
      wpMenu(name: {eq: "primary"}) {
        id
        menuItems {
          nodes {
            id
            label
            path
            parentId
            cssClasses
          }
        }
      }
    }
  `);

  const footer = await graphql(`
    query MyQuery {
      wpMenu(name: {eq: "footer"}) {
        id
        menuItems {
          nodes {
            id
            label
            path
            parentId
            cssClasses
          }
        }
      }
    }
  `);

  const options = await graphql(`
  query MyQuery {
    wp {
      acfOptions {
        footerContent {
          email
          germanKitchenText
          openingTimes
          phoneNumber
          visitOurShowroom
          mainLogo {
            altText
            mediaItemUrl
          }
        }
      }
    }    
  }
`);




  // const lastDetail = await graphql(`
  //   query MyQuery {
  //     allWpLastChance(
  //       filter: {
  //         lastChanceSingularPage: { lastChanceSoldOutSelect: { ne: "sold" } }
  //       }
  //     ) {
  //       edges {
  //         node {
  //           id
  //           uri
  //           databaseId
  //         }
  //       }
  //     }
  //   }
  // `);

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

  if (primary.errors) {
    throw new Error(primary.errors);
  }

  if (footer.errors) {
    throw new Error(footer.errors);
  }
  if (mobileMenu.errors) {
    throw new Error(mobileMenu.errors);
  }
  
  if (options.errors) {
    throw new Error(options.errors);
  }
  
  // if (lastDetail.errors) {
  //   throw new Error(lastDetail.errors);
  // }

  const identityNode = identity.data?.allWpPage || [];
  const brandsNode = brands.data?.allWpPage.edges || [];
  const roomNode = roomTypes.data?.allWpPage.edges || [];
  // const portfolioPageinfo = portfolio.data?.allWpPortfolio.pageInfo || [];

  const BlogDetailPage = BlogDetail.data?.allWpPost.edges || [];
  // const lastDetailPage = lastDetail.data?.allWpLastChance.edges || [];

  const primaryNode = primary.data?.wpMenu?.menuItems?.nodes || [];
  const mobileMenuNode = mobileMenu.data?.wpMenu?.menuItems?.nodes || [];
  const footerNode = footer.data?.wpMenu?.menuItems?.nodes || [];
  
  const optionsNode = options.data?.wp?.acfOptions?.footerContent || [];  

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

  const flatListToHierarchical = (
    data = [],
    { idKey = "id", parentKey = "parentId", childrenKey = "children" } = {}
  ) => {
    const tree = []
    const childrenOf = {}
    data.forEach(item => {
      const newItem = { ...item }
      const { [idKey]: id, [parentKey]: parentId = 0 } = newItem
      childrenOf[id] = childrenOf[id] || []
      newItem[childrenKey] = childrenOf[id]
      parentId
        ? (childrenOf[parentId] = childrenOf[parentId] || []).push(newItem)
        : tree.push(newItem)
    })
    return tree
  }

  $privHrhl = flatListToHierarchical(primaryNode);
  $MobtHrhl = flatListToHierarchical(mobileMenuNode);
  $footHrhl = flatListToHierarchical(footerNode);
  // lastDetailPage.forEach(({ node }) => {
  //   createPage({
  //     path: node.uri,
  //     component: path.resolve("./src/templates/LastChancePage.js"),
  //     context: {
  //       pageId: node.databaseId,
  //       pageUri: node.uri,
  //     },
  //   });
  // });
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
    context:{priMenuData:$privHrhl, mobMenuData:$MobtHrhl}
  });

  createSlice({
    id: `footer`,
    component: require.resolve(`./src/components/Footer.js`),
    context:{footerData:$footHrhl, options:optionsNode}
  });

  redirects.forEach((redirect) =>
    createRedirect({
      fromPath: redirect.fromPath,
      toPath: redirect.toPath,
      isPermanent: true,
      redirectInBrowser: true,
    })
  );


};

exports.onCreateWebpackConfig = ({ stage, loaders, actions }) => {
  if (stage === "build-html" || stage === "develop-html") {
    actions.setWebpackConfig({
      module: {
        rules: [
          {
            test: /isotope-layout/,
            use: loaders.null(),
          },
        ],
      },
    })
  }
}
