import {
  reactExtension,
  Banner,
  View,
  Checkbox,
  Text,
  useApi,
  useApplyAttributeChange,
  useInstructions,
  useCartLines,
  useTranslate,
  useBuyerJourneyActiveStep
} from "@shopify/ui-extensions-react/checkout";

// 1. Choose an extension target
export default reactExtension("purchase.checkout.block.render", () => (
  <Extension />
));

function Extension() {
  const translate = useTranslate();
  const { extension } = useApi();
  const instructions = useInstructions();
  const applyAttributeChange = useApplyAttributeChange();
  const items = useCartLines();
  const step = useBuyerJourneyActiveStep();
  let preorderFound = null;
  for(let i=0; i<items.length;i++){
    preorderFound = items[i].attributes.find((prop)=> prop.key == "Preorder");
    if(preorderFound){
      break
    }
  }
  // 3. Render a UI
  return (
    <View  visibility={preorderFound && step?.handle == "payment" ? "" : "hidden"}>
      <Banner title={`You have a pre-order item(s) in your cart. Your order will be shipped by ${preorderFound?.value}.`}>
      Items available for pre-order will be shipped along with in-stock items. If you want other items to arrive early, please order separately.  
      </Banner>
    </View>
  );

}