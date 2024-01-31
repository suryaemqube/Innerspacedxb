import React from "react";

export default function Map({ pageAcf }) {
    return (
        pageAcf && pageAcf.mapHtml && (
           
                <span dangerouslySetInnerHTML={{ __html: pageAcf.mapHtml }} />
           
        )
    );
}
