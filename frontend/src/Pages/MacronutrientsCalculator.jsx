import React, { useState } from 'react';
import backgroundImg from '../images/mealBck1.jpg';

const MacronutrientsCalculator = () => {
    const [mealItems, setMealItems] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [newItem, setNewItem] = useState({
        name: '',
        calories: '',
        protein: '',
        carbs: '',
        fat: '',
        quantity: 1,
    });

    const handleNewItemChange = (e) => {
        const { name, value } = e.target;
        setNewItem((prevItem) => ({
            ...prevItem,
            [name]: name === 'name' ? value : value
        }));
    };

    const handleAddNewItem = () => {
        if (!newItem.name.trim()) {
            alert('Please enter the name of the item.');
            return;
        }
        if (newItem.calories === '' || newItem.protein === '' || newItem.carbs === '' || newItem.fat === '') {
            alert('Please enter all nutritional values.');
            return;
        }
        setMealItems((prevItems) => [...prevItems, { ...newItem, id: Date.now() }]);
        setNewItem({ name: '', calories: '', protein: '', carbs: '', fat: '', quantity: 1 }); // Reset the form
        setIsEditing(false);
    };


    const handleCancelEdit = () => {
        setNewItem({ name: '', calories: '', protein: '', carbs: '', fat: '' });
        setIsEditing(false);
    };


    const handleIncreaseQuantity = (id) => {
        setMealItems((currentItems) =>
            currentItems.map((item) =>
                item.id === id ? { ...item, quantity: item.quantity + 1 } : item
            )
        );
    };

    const handleDecreaseQuantity = (id) => {
        setMealItems((currentItems) =>
            currentItems.map((item) =>
                item.id === id ? { ...item, quantity: Math.max(item.quantity - 1, 0) } : item
            )
        );
    };

    const handleDeleteItem = (id) => {
        setMealItems(mealItems.filter((item) => item.id !== id));
    };

    const handleEditItem = (id) => {
        const itemToEdit = mealItems.find((item) => item.id === id);
        if (itemToEdit) {
            setNewItem({ ...itemToEdit });
            setIsEditing(true);
        }
    };

    const handleUpdateItem = () => {
        if (!newItem.name.trim()) {
            alert('Please enter the name of the item.');
            return;
        }
        if (newItem.calories === '' || newItem.protein === '' || newItem.carbs === '' || newItem.fat === '') {
            alert('Please enter all nutritional values.');
            return;
        }
        setMealItems((currentItems) =>
            currentItems.map((item) => (item.id === newItem.id ? { ...newItem } : item))
        );
        setNewItem({ name: '', calories: '', protein: '', carbs: '', fat: '', quantity: 1 });
        setIsEditing(false);
    };

    const handleAddOrUpdateItem = () => {
        if (isEditing) {
            handleUpdateItem();
        } else {
            handleAddNewItem();
        }
    };


    // Function to calculate totals
    const calculateTotals = () => {
        return mealItems.reduce(
            (totals, item) => {
                totals.calories += parseFloat(item.calories || 0) * item.quantity;
                totals.protein += parseFloat(item.protein || 0) * item.quantity;
                totals.carbs += parseFloat(item.carbs || 0) * item.quantity;
                totals.fat += parseFloat(item.fat || 0) * item.quantity;
                return totals;
            },
            { calories: 0, protein: 0, carbs: 0, fat: 0 }
        );
    };

    const totals = calculateTotals();

    return (
        <div
            className="container mx-auto p-4"
            style={{
                backgroundImage: `url(${backgroundImg})`,
                backgroundPosition: 'center', // Centers the image
                backgroundRepeat: 'no-repeat', // Prevents repeating the image
                backgroundSize: 'cover', // Covers the entire div
                backgroundAttachment: 'fixed' // Optional: makes the background fixed during scroll
            }}>
            <h1 className="text-3xl font-bold mb-6 text-center">Meal Plan</h1>

            {/* Form for new meal item input */}
            <div className="mb-4 flex flex-wrap gap-2 justify-center">
                <input
                    type="text"
                    name="name"
                    placeholder="Item Name"
                    value={newItem.name}
                    onChange={handleNewItemChange}
                    className="border rounded h-10 w-40 p-2"
                />
                <input
                    type="number"
                    name="calories"
                    placeholder="Calories"
                    value={newItem.calories}
                    onChange={handleNewItemChange}
                    className="border rounded h-10 w-40 p-2"
                />
                <input
                    type="number"
                    name="protein"
                    placeholder="Protein (g)"
                    value={newItem.protein}
                    onChange={handleNewItemChange}
                    className="border rounded h-10 w-40 p-2"
                />
                <input
                    type="number"
                    name="carbs"
                    placeholder="Carbs (g)"
                    value={newItem.carbs}
                    onChange={handleNewItemChange}
                    className="border rounded h-10 w-40 p-2"
                />
                <input
                    type="number"
                    name="fat"
                    placeholder="Fat (g)"
                    value={newItem.fat}
                    onChange={handleNewItemChange}
                    className="border rounded h-10 w-40 p-2"
                />

            </div>
            <div className="mb-4 flex flex-wrap gap-5 justify-center">
                <button
                    onClick={handleAddOrUpdateItem}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    {isEditing ? 'Update Item' : 'Add Item'}
                </button>
                <button
                    onClick={handleCancelEdit}
                    className="bg-red-700 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Cancel
                </button>
            </div>

            {/* List of meal items */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {mealItems.map((item) => (
                    <div key={item.id} className="bg-white p-3 shadow rounded-lg space-y-3">
                        <h3 className="text-md font-semibold">{item.name}</h3>
                        <p className="text-sm">Calories: {item.calories}</p>
                        <p className="text-sm">Protein: {item.protein}g</p>
                        <p className="text-sm">Carbs: {item.carbs}g</p>
                        <p className="text-sm">Fat: {item.fat}g</p>
                        <div className="flex items-center justify-between text-sm">
                            <button onClick={() => handleIncreaseQuantity(item.id)} className="bg-green-500 text-white px-8 py-2 rounded hover:bg-green-600 text-sm font-medium">+</button>
                            <span>{item.quantity}</span>
                            <button onClick={() => handleDecreaseQuantity(item.id)} className="bg-red-500 text-white px-8 py-2 rounded hover:bg-red-600 text-sm font-medium">-</button>
                        </div>
                        <div className="flex justify-between text-sm">
                            <button onClick={() => handleEditItem(item.id)} className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 text-xs font-medium">Edit</button>
                            <button onClick={() => handleDeleteItem(item.id)} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 text-xs font-medium">Delete</button>
                        </div>
                    </div>
                ))}
            </div>


            {/* Total Nutrients */}
            <div className="mt-6 p-4 bg-white rounded shadow">
                <h3 className="text-xl font-bold mb-4">Total Nutrients</h3>
                <p>Total Calories: {totals.calories}</p>
                <p>Total Protein: {totals.protein}g</p>
                <p>Total Carbs: {totals.carbs}g</p>
                <p>Total Fat: {totals.fat}g</p>
            </div>
        </div>
    );
};

export default MacronutrientsCalculator;