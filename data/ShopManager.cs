using UnityEngine;
using UnityEngine.UI;
using System.Collections.Generic;
using Newtonsoft.Json;
using System.Net.Http;
using System.Threading.Tasks;

public class ShopManager : MonoBehaviour
{
    public GameObject shopPanel;
    public GameObject itemPrefab;
    public Transform itemContainer;

    private string shopUrl = "https://raw.githubusercontent.com/[USERNAME]/[REPO]/main/data/shop.json";
    private string itemsUrl = "https://raw.githubusercontent.com/[USERNAME]/[REPO]/main/data/items.json";

    private List<ItemData> items = new List<ItemData>();

    private void Start()
    {
        shopPanel.SetActive(false);
    }

    public async void OpenShop()
    {
        shopPanel.SetActive(true);
        await LoadShopData();
    }

    public void CloseShop()
    {
        shopPanel.SetActive(false);
    }

    private async Task LoadShopData()
    {
        using (HttpClient client = new HttpClient())
        {
            string shopJson = await client.GetStringAsync(shopUrl);
            string itemsJson = await client.GetStringAsync(itemsUrl);

            ShopConfig shop = JsonConvert.DeserializeObject<ShopConfig>(shopJson);
            items = JsonConvert.DeserializeObject<List<ItemData>>(itemsJson);

            foreach (Transform child in itemContainer)
                Destroy(child.gameObject);

            foreach (var sItem in shop.items)
            {
                ItemData data = items.Find(x => x.id == sItem.id);
                CreateItemCard(data);
            }
        }
    }

    void CreateItemCard(ItemData item)
    {
        GameObject card = Instantiate(itemPrefab, itemContainer);
        card.transform.Find("ItemName").GetComponent<Text>().text = item.name;
        card.transform.Find("Price").GetComponent<Text>().text = item.price.ToString();
        card.transform.Find("BuyButton").GetComponent<Button>().onClick.AddListener(() => BuyItem(item));
    }

    void BuyItem(ItemData item)
    {
        Debug.Log("Buying item: " + item.name);
        // آگے PlayerData میں save ہوگا
    }
}

[System.Serializable]
public class ItemData
{
    public int id;
    public string name;
    public int price;
    public string icon;
}

[System.Serializable]
public class ShopConfig
{
    public bool shopEnabled;
    public List<ItemRef> items;
}

[System.Serializable]
public class ItemRef
{
    public int id;
}
