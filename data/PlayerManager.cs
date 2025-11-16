using UnityEngine;
using Newtonsoft.Json;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

public class PlayerManager : MonoBehaviour
{
    public int coins;
    public List<int> inventory;

    private string playerUrl = "https://api.github.com/repos/[USERNAME]/[REPO]/contents/data/playerData.json";

    public async Task SavePlayerData()
    {
        PlayerData data = new PlayerData()
        {
            coins = coins,
            inventory = inventory
        };

        string json = JsonConvert.SerializeObject(data, Formatting.Indented);
        byte[] content = Encoding.UTF8.GetBytes(json);

        using (HttpClient client = new HttpClient())
        {
            client.DefaultRequestHeaders.UserAgent.ParseAdd("request");

            var payload = new
            {
                message = "Update player data",
                content = System.Convert.ToBase64String(content)
            };

            string body = JsonConvert.SerializeObject(payload);

            await client.PutAsync(playerUrl, new StringContent(body, Encoding.UTF8, "application/json"));
        }
    }

    public bool Buy(int price, int itemId)
    {
        if (coins < price)
        {
            Debug.Log("Not enough coins!");
            return false;
        }

        coins -= price;
        inventory.Add(itemId);

        _ = SavePlayerData();

        return true;
    }
}

[System.Serializable]
public class PlayerData
{
    public int coins;
    public List<int> inventory;
}
