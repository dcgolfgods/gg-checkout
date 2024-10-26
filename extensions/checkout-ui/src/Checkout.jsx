import {
  reactExtension,
  Banner,
  BlockStack,Pressable,
  View,
  Text,InlineLayout,
  useApi,
  useApplyAttributeChange,
  useInstructions,
  useTranslate, useCartLines, Image, useApplyCartLinesChange
} from "@shopify/ui-extensions-react/checkout";
import { useEffect, useState } from "react";

// 1. Choose an extension target
export default reactExtension("purchase.checkout.block.render", () => (
  <Extension />
));

function Extension() {
  const translate = useTranslate();
  const { extension } = useApi();
  const instructions = useInstructions();
  const applyAttributeChange = useApplyAttributeChange();
  const initialTime = 600; // 10 minutes in seconds
  const [timeLeft, setTimeLeft] = useState(initialTime); // 9 hours in seconds
  const applyCartLinesChange = useApplyCartLinesChange();
  const vid = 'gid://shopify/ProductVariant/40294872416342';
  const lines = useCartLines();
  const isItemInCart = lines.some(line => line.merchandise.id === vid);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime > 0) {
          return prevTime - 1;
        } else {
          return initialTime; // Reset to 10 minutes after it reaches 0
        }
      });
    }, 1000);

    return () => clearInterval(timer); // Cleanup the timer on unmount
  }, []);


  const handleAddToCart = async () => {
    const result = await applyCartLinesChange({
      type: 'addCartLine',
      merchandiseId: vid, // Replace with actual merchandise ID
      quantity: 1,
    });

    if (result.type === 'success') {
      console.log('Product added to cart successfully!');
    } else {
      console.error('Failed to add product to cart:', result.message);
    }
  };


  // Format time to MM:SS
  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = String(Math.floor(seconds / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  // 2. Check instructions for feature availability, see https://shopify.dev/docs/api/checkout-ui-extensions/apis/cart-instructions for details
  if (!instructions.attributes.canUpdateAttributes) {
    // For checkouts such as draft order invoices, cart attributes may not be allowed
    // Consider rendering a fallback UI or nothing at all, if the feature is unavailable
    return (
      <Banner title="checkout-ui" status="warning">
        {translate("attributeChangesAreNotSupported")}
      </Banner>
    );
  }
  const img = "https://cdn.shopify.com/s/files/1/0590/2381/8850/files/Screenshot_2024-10-25_at_12.23.31_AM_1.png?v=1729879963"
  // 3. Render a UI
  if (isItemInCart) {
    return null;
  }
  return (
    <BlockStack spacing="tight">
    {/* Double Entries Banner */}
    <View background="highlight">
      <Image source={"https://cdn.shopify.com/s/files/1/0590/2381/8850/files/Frame_10.png?v=1729878601"} description="Double Cash Entries Sticker Pack" />
    </View>

    {/* Countdown Timer */}
    <View display="block" blockAlignment="center" inlineAlignment="center">
    <Text size="large"  alignment="center">
      ENDS IN: {formatTime(timeLeft)}
    </Text>
    </View>
    {/* Product Section (Image + Details in same row) */}
    <InlineLayout  columns={['20%', '40%']} >
      {/* Product Image */}
      <View padding="base">
          <Image source={img} description="Double Cash Entries Sticker Pack" />
      </View>

      {/* Product Information */}
      <BlockStack spacing="tight">
        <View>
        <BlockStack spacing="tight">
            <Text size="large" emphasized>
              Double Cash Entries Sticker Pack
            </Text>
            <Text size="large" subdued>
              $20
            </Text>
           
            <View on background="highlight">
              <Pressable onPress={handleAddToCart}>
            <Image source={"https://cdn.shopify.com/s/files/1/0590/2381/8850/files/Screenshot.png?v=1729880056"} description="Double Cash Entries Sticker Pack" />
            </Pressable>
          </View>
           
        </BlockStack >
      </View>
      </BlockStack>
    </InlineLayout>

    {/* Add to Bag Button */}
    
  </BlockStack>
  );

  async function onCheckboxChange(isChecked) {
    // 4. Call the API to modify checkout
    const result = await applyAttributeChange({
      key: "requestedFreeGift",
      type: "updateAttribute",
      value: isChecked ? "yes" : "no",
    });
    console.log("applyAttributeChange result", result);
  }
}