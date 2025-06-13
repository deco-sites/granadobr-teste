import {
  Product,
  ProductDetailsPage,
  PropertyValue,
} from "apps/commerce/types.ts";
import { useScriptAsDataURI } from "deco/hooks/useScript.ts";
import { JSX } from "preact";
import { useCallback, useMemo } from "preact/hooks";
import ReviewsTab, {
  Props as ReviewsData,
  ReviewsTabTexts,
} from "site/components/product/ReviewsTab.tsx";
import Icon from "site/components/ui/Icon.tsx";
import { useId } from "../../sdk/useId.ts";

export interface ProductTabs {
  detais: string;
  howToUse: string;
  moreInformation: {
    name: string;
    fragrance: string;
    volume: string;
    brand: string;
    line: string;
  };
  ingredients: string;
  reviews: string;
}

export interface Props {
  page: ProductDetailsPage;
  reviews: Product["review"];
  additionalProperty: Product["additionalProperty"];
  reviewsTabTexts?: ReviewsTabTexts;
  notFoundText: string;
  productTabs: ProductTabs;
  isMobile: boolean;
}

interface Tab {
  name: string;
  content?: string;
  component?: (props: {
    reviewsData?: ReviewsData;
    texts: ReviewsTabTexts;
  }) => JSX.Element;
  componentProps?: {
    reviewsData?: ReviewsData;
    texts: ReviewsTabTexts;
  };
}

function convertProperties(
  additionalProperties: PropertyValue[] | undefined,
): Record<string, string | undefined> {
  return (
    additionalProperties?.reduce((acc, prop) => {
      if (prop.name) {
        acc[prop.name] = prop.value;
      }
      return acc;
    }, {} as Record<string, string | undefined>) || {}
  );
}

function ProductDetailsTabs(
  { page, reviewsTabTexts, productTabs, isMobile }: Props,
) {
  const id = useId();
  const additionalProperty = page.product.additionalProperty;

  const productProperties = useMemo(
    () => convertProperties(additionalProperty),
    [additionalProperty],
  );

  const tabs: Tab[] = useMemo(
    () =>
      [
        {
          name: productTabs?.detais,
          content: productProperties.description
            ? `
          <div class="whitespace-normal break-words">
            ${productProperties.description}
          </div>
        `
            : "",
        },
        {
          name: productTabs?.howToUse,
          content: productProperties["como_usar__phebo"]
            ? `
          <div class="whitespace-normal break-words">
            ${productProperties["como_usar__phebo"]}
          </div>
        `
            : undefined,
        },
        {
          name: productTabs?.moreInformation.name,
          content: `
          <div class="bg-[#f6f3f8] p-4 rounded whitespace-normal break-words">
            ${
            productProperties["marca_str"]
              ? `
              <div class="flex flex-wrap">
                <div class="font-bold pr-4 ${
                productProperties["fragrancias_str"] ? "w-[110px]" : "w-[80px]"
              }">${productTabs?.moreInformation.brand}</div>
                <div class="mb-2 w-auto">${productProperties["marca_str"]}</div>
              </div>`
              : undefined
          }
            ${
            productProperties["fragrancias_str"]
              ? `
              <div class="flex flex-wrap">
                <div class="font-bold pr-4 ${
                productProperties["fragrancias_str"] ? "w-[110px]" : "w-[80px]"
              }">${productTabs?.moreInformation.fragrance}</div>
                <div class="mb-2 w-auto">${
                productProperties["fragrancias_str"]
              }</div>
              </div>`
              : undefined
          }
            ${
            productProperties["linha_str"]
              ? `
              <div class="flex flex-wrap">
                <div class="font-bold pr-4 ${
                productProperties["fragrancias_str"] ? "w-[110px]" : "w-[80px]"
              }">${productTabs?.moreInformation.line}</div>
                <div class="mb-2 w-auto">${productProperties["linha_str"]}</div>
              </div>`
              : undefined
          }
            ${
            productProperties["volume_str"]
              ? `
              <div class="flex flex-wrap">
                <div class="font-bold pr-4 ${
                productProperties["fragrancias_str"] ? "w-[110px]" : "w-[80px]"
              }">${productTabs?.moreInformation.volume}</div>
                <div class="w-auto">${productProperties["volume_str"]}</div>
              </div>`
              : undefined
          }
          </div>
        `,
        },
        {
          name: productTabs?.ingredients,
          content: productProperties["ingredientes__phebo"]
            ? `
          <div class="whitespace-normal break-words">
            ${productProperties["ingredientes__phebo"]}
          </div>
        `
            : undefined,
        },
        {
          name: productTabs?.reviews ?? "Avaliações",
          component: ReviewsTab,
          componentProps: {
            reviewsData: page.product.review,
            texts: reviewsTabTexts!,
          },
        },
      ].filter((tab) => tab.content || tab.component),
    [productProperties, reviewsTabTexts, productTabs],
  );

  const renderTabContent = useCallback((tab: Tab) => {
    if (tab.component) {
      const Component = tab.component;
      return <Component {...tab.componentProps} />;
    }
    return <div dangerouslySetInnerHTML={{ __html: tab.content || "" }} />;
  }, []);

  return (
    <div
      id={`pdp-tab-${id}`}
      className="lg:mt-20 2xl:mt-[100px] font-matria text-lg lg:text-sm xl:text-lg font-normal"
    >
      {!isMobile
        ? (
          <>
            <ul className="hidden md:flex overflow-x-auto whitespace-nowrap">
              {tabs.map((tab, index) => (
                <label
                  htmlFor={tab.name}
                  key={index}
                  className={`group flex items-center cursor-pointer px-5 lg:px-4 xl:px-5 py-4 ${
                    index === 0 ? "bg-[#f6f3f8] text-green-800" : ""
                  }`}
                  data-button="pdp-tab-item"
                >
                  {tab.name}
                </label>
              ))}
            </ul>
            <div className="text-base hidden md:block p-[32px] bg-[#f6f3f8] text-[#333333] rounded">
              {tabs.map((tab, index) => (
                <div>
                  <input
                    type="radio"
                    class="hidden peer"
                    name={`pdp-tab-input-${id}`}
                    id={tab.name}
                    key={tab.name}
                    checked={index === 0}
                  />
                  <div className="hidden peer-checked:block" id={tab.name}>
                    {renderTabContent(tab)}
                  </div>
                </div>
              ))}
            </div>
            <script
              // deno-lint-ignore react-rules-of-hooks
              src={useScriptAsDataURI((id) => {
                const pdpTab = document.getElementById(`pdp-tab-${id}`);
                const labels = pdpTab?.querySelectorAll(`label[for]`);

                if (labels) {
                  labels.forEach((label) => {
                    label.addEventListener("click", () => {
                      labels.forEach((label) => {
                        label.classList.remove("bg-[#f6f3f8]");
                        label.classList.remove("text-green-800");
                      });

                      label.classList.add("bg-[#f6f3f8]");
                      label.classList.add("text-green-800");
                    });
                  });
                }
              }, id)}
            />
          </>
        )
        : (
          <ul className="">
            {tabs.map((tab, index) => (
              <li
                key={index}
                className={"bg-white text-[#929292]"}
              >
                <input
                  type="radio"
                  class="hidden peer"
                  name={`pdp-tab-input-${id}`}
                  id={tab.name}
                  key={tab.name}
                  checked={index === 0}
                />
                <label
                  htmlFor={tab.name}
                  className={`py-5 px-4 flex flex-row justify-between items-center  peer-checked:border-t-[1px]
                   border-b-[1px] border-[#E3E3E3] text-[#1D1D1D] peer-checked:bg-[#f6f3f8] peer-checked:text-green-800`}
                >
                  {tab.name}
                  <Icon
                    id="ChevronUp"
                    strokeWidth={0.01}
                    className={`text-sm 2xl:text-[17px] font-matria font-normal h-[20px] w-[20px] 2xl:h-[24px] 2xl:w-[24px] ${
                      index === 0 ? "rotate-0" : "rotate-180"
                    }`}
                  />
                </label>

                <div className="peer-checked:max-h-[10000px] max-h-0 overflow-hidden peer-checked:bg-[#f6f3f8] text-base border-b-[1px] rounded-b-[5px] border-[#CCCCCC] px-4 peer-checked:py-8 text-[#333333] transition-all duration-300">
                  {renderTabContent(tab)}
                </div>
              </li>
            ))}
          </ul>
        )}
    </div>
  );
}

export default function ProductDetailsPageWrapper(props: Props) {
  if (!props.page) {
    return <p>{props.notFoundText}</p>;
  }

  return <ProductDetailsTabs {...props} />;
}
