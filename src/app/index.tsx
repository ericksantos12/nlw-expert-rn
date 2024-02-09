import { CategoryButton } from '@/components/category-button';
import { Header } from '@/components/header';
import { Product } from '@/components/product';
import { CATEGORIES, MENU } from '@/utils/data/products';
import { useRef, useState } from 'react';
import { FlatList, SectionList, Text, View } from 'react-native';
import { Link } from 'expo-router';
import { useCartStore } from '@/stores/cart-store';

export default function Home() {
    const cartStore = useCartStore();
    const [category, setCategory] = useState(CATEGORIES[0]);
    const cartQuantityItems = cartStore.products.reduce((total, product) => total + product.quantity, 0)

    const sectionListRef = useRef<SectionList>(null);

    function handleCategorySelect(selectedCategory: string) {
        setCategory(selectedCategory);

        const sectionIndex = CATEGORIES.findIndex(
            (category) => category === selectedCategory
        );

        if (sectionListRef.current) {
            sectionListRef.current.scrollToLocation({
                animated: true,
                sectionIndex,
                itemIndex: 0,
            });
        }
    }

    return (
        <View className='bg-slate-900 flex-1 pt-10'>
            <Header title='Faça seu pedido' cartQuantityItems={cartQuantityItems} />
            <FlatList
                data={CATEGORIES}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                    <CategoryButton
                        title={item}
                        isSelected={item === category}
                        onPress={() => handleCategorySelect(item)}
                    />
                )}
                horizontal
                className='max-h-10 mt-5'
                contentContainerStyle={{ gap: 12, paddingHorizontal: 20 }}
                showsHorizontalScrollIndicator={false}
            />

            <SectionList
                ref={sectionListRef}
                sections={MENU}
                keyExtractor={(item) => item.id}
                stickySectionHeadersEnabled={false}
                renderItem={({ item }) => (
                    <Link href={`/product/${item.id}`} asChild>
                        <Product data={item} />
                    </Link>
                )}
                renderSectionHeader={({ section: { title } }) => (
                    <Text className='text-xl text-white font-heading mt-8 mb-3'>
                        {title}
                    </Text>
                )}
                className='flex-1 p-5'
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
            />
        </View>
    );
}
