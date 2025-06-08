import {
  reactExtension,
  InlineStack,
  Button,
  InlineLayout,
  Image,
  View,
  Text,
  useApi,
  useCartLines,
} from "@shopify/ui-extensions-react/checkout";
// 1. Choose an extension target
export default reactExtension("purchase.checkout.block.render", () => (
  <Extension />
));

function Extension() {
  const { extension, applyCartLinesChange } = useApi();
  const cartLines = useCartLines();

  // Check if bump-up variant already exists in cart
  const bumpUpVariantId = "gid://shopify/ProductVariant/39524281319510"; // Replace with your actual variant ID
  const bumpUpExists = cartLines.some(line => line.merchandise.id === bumpUpVariantId);
  console.log(cartLines);
  // Don't show if already in cart
  if (bumpUpExists) {
    return null;
  }

  const handleAddBumpUp = async () => {
    // setIsLoading(true);
    try {
      const result = await applyCartLinesChange({
        type: "addCartLine",
        merchandiseId: bumpUpVariantId,
        quantity: 1,
        attributes: [
          {
            key: "priority_dispatch",
            value: "true"
          }
        ]
      });

      if (result.type === 'error') {
        console.error('Failed to add product:', result.message);
      }
    } catch (error) {
      console.error('Error adding product:', error);
    } finally {
      // setIsLoading(false);
    }
  };

  return (
    <InlineLayout border="base" borderRadius="base" padding="tight" background="subdued" columns={['15%', 'fill']} >
      <View gap="none" border="base" borderRadius="base">
        <Image
          source="https://cdn.shopify.com/s/files/1/0034/5230/5520/files/unnamed1_cbbfce94-3720-4f5b-8a23-3ff070834a13.webp?v=1749368830"
          alt="Speedometer icon"
          maxInlineSize={300}
        />
      </View>
      <InlineLayout padding="tight" background="" columns={['80%', 'fill']} >
        <View gap="none">
          <InlineStack>
            <Text size="base" emphasis="bold">Order Bump-Up (Priority Dispatch)</Text>
          </InlineStack>
          <InlineStack>
            <Text size="small" appearance="subdued">Skip The Queue</Text>
          </InlineStack>
          <InlineStack >
            <Text emphasis="bold">$13.00</Text>
          </InlineStack>
        </View>

        <InlineStack blockAlignment="end" inlineAlignment="end">
          <View>
            <Button
              onPress={handleAddBumpUp}
              kind="primary"
            >
              Add
            </Button>
          </View>
        </InlineStack>
      </InlineLayout>
    </InlineLayout>
  );
}