using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AnagramFinder
{
	class Program
	{
		static string sortLetters(string word)
		{
			var sortedLetters = (from letter in word
								 orderby letter ascending
								 select letter).ToArray();

			return new String(sortedLetters);
		}

		static void Main(string[] args)
		{
			string[] words = System.IO.File.ReadAllLines(@"C:\Users\benh\Documents\wordplay\dict\english_all.txt");
			var wordCounts = new Dictionary<string, int>();
			
			// remove apostrophes from words
			for (int i = 0; i < words.Length; ++i)
				words[i] = words[i].Replace("'", "");
	
			// remove duplicates
			words = words.Distinct().ToArray();

			// set up the initial map of sorted words to words
			for (int i = 0; i < words.Length; ++i)
				wordCounts.Add(words[i], 0);

			var sortedWords = new Dictionary<string, List<string>>();
			// key = sorted characters in each word
			// value = the word

			foreach (var word in words)
			{
				var key = sortLetters(word);
				if (!sortedWords.ContainsKey(key))
					sortedWords.Add(key, new List<string>());

				sortedWords[key].Add(word);
			}

			// For each anagram you want to find, sort the characters in your anagram word, and 
			// then match against the index to retrieve all words from index with matching sorted key.
			StringBuilder sb = new StringBuilder();

			var anagrams = new Dictionary<string, List<string>>();
			foreach (var cword in words)
			{
				List<string> anagramAccumulator = new List<string>();
				var word = cword;
				while (word.Length > 2)
				{
					var key = sortLetters(word);
					if (sortedWords.ContainsKey(key))
						anagramAccumulator.AddRange(sortedWords[key]);
					word = word.Substring(0, word.Length - 1);
				}
				anagrams.Add(cword, anagramAccumulator);
			}

			var query = from anagram in anagrams
						let o = new { word = anagram.Key, count = anagram.Value.Count, anagrams = anagram.Value }
						//where o.count > 10 && o.word.Length < 15
						where o.count > 2
						orderby o.count descending
						select o;

			using (var f = System.IO.File.CreateText(@"C:\Users\benh\Documents\wordplay\dict\english_all.json"))
			{
				int i = 0;
				f.Write("{");
				var jsons = new List<string>();
				foreach (var item in query)
				{
					var str = String.Format("{0}\t{1}\n", item.word, item.count);

					var quotedAnagrams = item.anagrams.ToArray();
					for (int j= 0; j < quotedAnagrams.Length; ++j)
						quotedAnagrams[j] = "'" + quotedAnagrams[j] + "'";
					var json = String.Format("'{0}':[{1}]", item.word, String.Join(",", quotedAnagrams));
					jsons.Add(json);
					Console.Write(i + ":\t" + str);
					++i;
				}
				f.Write(string.Join(",\n", jsons));
				f.Write("}");
				f.Close();
			}
		}



	}
}
